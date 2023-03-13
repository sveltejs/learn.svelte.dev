import { WebContainer } from '@webcontainer/api';
import base64 from 'base64-js';
import AnsiToHtml from 'ansi-to-html';
import { get_depth } from '../../../utils.js';
import { ready } from '../common/index.js';

const converter = new AnsiToHtml({
	fg: 'var(--sk-text-3)'
});

/** @type {import('@webcontainer/api').WebContainer} Web container singleton */
let vm;

/**
 * @param {import('svelte/store').Writable<string | null>} base
 * @param {import('svelte/store').Writable<Error | null>} error
 * @param {import('svelte/store').Writable<{ value: number, text: string }>} progress
 * @param {import('svelte/store').Writable<string[]>} logs
 * @returns {Promise<import('$lib/types').Adapter>}
 */
export async function create(base, error, progress, logs) {
	if (/safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent)) {
		throw new Error('WebContainers are not supported by Safari');
	}

	progress.set({ value: 0, text: 'loading files' });

	/**
	 * Keeps track of the latest create/reset to ensure things are not processed in parallel.
	 * (if this turns out to be insufficient, we can use a queue)
	 * @type {Promise<any> | undefined}
	 */
	let running;

	/** Paths and contents of the currently loaded file stubs */
	let current_stubs = stubs_to_map([]);

	/** @type {boolean} Track whether there was an error from vite dev server */
	let vite_error = false;

	progress.set({ value: 1 / 5, text: 'booting webcontainer' });
	vm = await WebContainer.boot();

	progress.set({ value: 2 / 5, text: 'writing virtual files' });
	const common = await ready;
	await vm.mount({
		'common.zip': {
			file: { contents: new Uint8Array(common.zipped) }
		},
		'unzip.cjs': {
			file: { contents: common.unzip }
		}
	});

	const log_stream = () =>
		new WritableStream({
			write(chunk) {
				if (chunk === '\x1B[1;1H') {
					// clear screen
					logs.set([]);
				} else {
					const log = converter.toHtml(chunk);
					logs.update(($logs) => [...$logs, log]);
				}
			}
		});

	progress.set({ value: 3 / 5, text: 'unzipping files' });
	const unzip = await vm.spawn('node', ['unzip.cjs']);
	unzip.output.pipeTo(log_stream());
	const code = await unzip.exit;

	if (code !== 0) {
		throw new Error('Failed to initialize WebContainer');
	}

	await vm.spawn('chmod', ['a+x', 'node_modules/vite/bin/vite.js']);

	vm.on('server-ready', (_port, url) => {
		base.set(url);
	});

	vm.on('error', ({ message }) => {
		error.set(new Error(message));
	});

	let launched = false;

	async function launch() {
		if (launched) return;
		launched = true;

		progress.set({ value: 4 / 5, text: 'starting dev server' });

		await new Promise(async (fulfil, reject) => {
			const error_unsub = vm.on('error', (error) => {
				error_unsub();
				reject(new Error(error.message));
			});

			const ready_unsub = vm.on('server-ready', (_port, base) => {
				ready_unsub();
				progress.set({ value: 5 / 5, text: 'ready' });
				fulfil(base); // this will be the last thing that happens if everything goes well
			});

			await run_dev();

			async function run_dev() {
				const process = await vm.spawn('turbo', ['run', 'dev']);

				// TODO differentiate between stdout and stderr (sets `vite_error` to `true`)
				// https://github.com/stackblitz/webcontainer-core/issues/971
				process.output.pipeTo(log_stream());

				// keep restarting dev server (can crash in case of illegal +files for example)
				await process.exit;
				run_dev();
			}
		});
	}

	return {
		reset: async (stubs) => {
			await running;
			/** @type {Function} */
			let resolve = () => {};
			running = new Promise((fulfil) => (resolve = fulfil));
			vite_error = false;

			let added_new_file = false;

			const previous_env = /** @type {import('$lib/types').FileStub=} */ (
				current_stubs.get('/.env')
			);

			/** @type {import('$lib/types').Stub[]} */
			const to_write = [];

			for (const stub of stubs) {
				if (stub.type === 'file') {
					const current = /** @type {import('$lib/types').FileStub} */ (
						current_stubs.get(stub.name)
					);

					if (current?.contents !== stub.contents) {
						to_write.push(stub);
					}

					if (!current) added_new_file = true;
				} else {
					// always add directories, otherwise convert_stubs_to_tree will fail
					to_write.push(stub);
				}

				current_stubs.delete(stub.name);
			}

			// Don't delete the node_modules folder when switching from one exercise to another
			// where, as this crashes the dev server.
			['/node_modules', '/node_modules/.bin'].forEach((name) => current_stubs.delete(name));

			const to_delete = Array.from(current_stubs.keys());
			current_stubs = stubs_to_map(stubs);

			// For some reason, server-ready is fired again when the vite dev server is restarted.
			// We need to wait for it to finish before we can continue, else we might
			// request files from Vite before it's ready, leading to a timeout.
			const will_restart = launched && to_write.some(will_restart_vite_dev_server);
			const promise = will_restart
				? new Promise((fulfil, reject) => {
						const error_unsub = vm.on('error', (error) => {
							error_unsub();
							resolve();
							reject(new Error(error.message));
						});

						const ready_unsub = vm.on('server-ready', (port, base) => {
							ready_unsub();
							console.log(`server ready on port ${port} at ${performance.now()}: ${base}`);
							resolve();
							fulfil(undefined);
						});

						setTimeout(() => {
							resolve();
							reject(new Error('Timed out resetting WebContainer'));
						}, 10000);
				  })
				: Promise.resolve();

			for (const file of to_delete) {
				await vm.fs.rm(file, { force: true, recursive: true });
			}

			// Adding a `.env` file does not restart Vite, but environment variables from `.env`
			// are not available until Vite is restarted. By creating a dummy `.env` file, it will
			// be recognized as changed when the real `.env` file is loaded into the Webcontainer.
			// This will invoke a restart of Vite. Hacky but it works.
			// TODO: remove when https://github.com/vitejs/vite/issues/12127 is closed
			if (!previous_env && current_stubs.has('/.env')) {
				await vm.spawn('touch', ['.env']);
			}

			await vm.mount(convert_stubs_to_tree(to_write));
			await promise;
			await new Promise((f) => setTimeout(f, 200)); // wait for chokidar

			resolve();

			// Also trigger a reload of the iframe in case new files were added / old ones deleted,
			// because that can result in a broken UI state
			const should_reload = !launched || will_restart || vite_error || to_delete.length > 0;
			// `|| added_new_file`, but I don't actually think that's necessary?

			await launch();

			return should_reload;
		},
		update: async (file) => {
			await running;

			/** @type {import('@webcontainer/api').FileSystemTree} */
			const root = {};

			let tree = root;

			const path = file.name.split('/').slice(1);
			const basename = /** @type {string} */ (path.pop());

			for (const part of path) {
				if (!tree[part]) {
					/** @type {import('@webcontainer/api').FileSystemTree} */
					const directory = {};

					tree[part] = {
						directory
					};
				}

				tree = /** @type {import('@webcontainer/api').DirectoryNode} */ (tree[part]).directory;
			}

			tree[basename] = to_file(file);

			await vm.mount(root);

			current_stubs.set(file.name, file);

			await new Promise((f) => setTimeout(f, 200)); // wait for chokidar

			return will_restart_vite_dev_server(file);
		}
	};
}

/**
 * @param {import('$lib/types').Stub} file
 */
function will_restart_vite_dev_server(file) {
	return (
		file.type === 'file' &&
		(file.name === '/vite.config.js' || file.name === '/svelte.config.js' || file.name === '/.env')
	);
}

/**
 * @param {import('$lib/types').Stub[]} stubs
 * @returns {import('@webcontainer/api').FileSystemTree}
 */
function convert_stubs_to_tree(stubs, depth = 1) {
	/** @type {import('@webcontainer/api').FileSystemTree} */
	const tree = {};

	for (const stub of stubs) {
		if (get_depth(stub.name) === depth) {
			if (stub.type === 'directory') {
				const children = stubs.filter((child) => child.name.startsWith(stub.name));

				tree[stub.basename] = {
					directory: convert_stubs_to_tree(children, depth + 1)
				};
			} else {
				tree[stub.basename] = to_file(stub);
			}
		}
	}

	return tree;
}

/** @param {import('$lib/types').FileStub} file */
function to_file(file) {
	// special case
	if (file.name === '/src/app.html') {
		const contents = file.contents.replace(
			'</head>',
			'<script type="module" src="/src/__client.js"></script></head>'
		);

		return {
			file: { contents }
		};
	}

	const contents = file.text ? file.contents : base64.toByteArray(file.contents);

	return {
		file: { contents }
	};
}

/**
 * @param {import('$lib/types').Stub[]} files
 * @returns {Map<string, import('$lib/types').Stub>}
 */
function stubs_to_map(files, map = new Map()) {
	for (const file of files) {
		map.set(file.name, file);
	}
	return map;
}
