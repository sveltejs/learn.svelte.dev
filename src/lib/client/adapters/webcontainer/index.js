import { load } from '@webcontainer/api';
import base64 from 'base64-js';
import { get_depth } from '../../../utils.js';
import { ready } from '../common/index.js';

/** @type {import('@webcontainer/api').WebContainer} Web container singleton */
let vm;

/**
 * @param {import('$lib/types').Stub[]} stubs
 * @param {(progress: number, status: string) => void} callback
 * @returns {Promise<import('$lib/types').AdapterInternal>}
 */
export async function create(stubs, callback) {
	if (/safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent)) {
		throw new Error('WebContainers are not supported by Safari');
	}

	callback(0, 'loading files');

	/**
	 * Keeps track of the latest create/reset to ensure things are not processed in parallel.
	 * (if this turns out to be insufficient, we can use a queue)
	 * @type {Promise<any> | undefined}
	 */
	let running;

	/** Paths and contents of the currently loaded file stubs */
	let current_stubs = stubs_to_map(stubs);

	/** @type {boolean} Track whether there was an error from vite dev server */
	let vite_error = false;

	callback(1 / 6, 'loading webcontainer');
	const WebContainer = await load();

	callback(2 / 6, 'booting webcontainer');
	vm = await WebContainer.boot();

	callback(3 / 6, 'writing virtual files');
	const common = await ready;
	await vm.loadFiles({
		'common.zip': {
			file: { contents: new Uint8Array(common.zipped) }
		},
		'unzip.cjs': {
			file: { contents: common.unzip }
		},
		...convert_stubs_to_tree(stubs)
	});

	callback(4 / 6, 'unzipping files');
	const unzip = await vm.run(
		{
			command: 'node',
			args: ['unzip.cjs']
		},
		{
			stderr: (data) => console.error(`[unzip] ${data}`)
		}
	);
	const code = await unzip.onExit;
	if (code !== 0) {
		throw new Error('Failed to initialize WebContainer');
	}

	await vm.run({ command: 'chmod', args: ['a+x', 'node_modules/vite/bin/vite.js'] });

	callback(5 / 6, 'starting dev server');
	const base = await new Promise(async (fulfil, reject) => {
		const error_unsub = vm.on('error', (error) => {
			error_unsub();
			reject(new Error(error.message));
		});

		const ready_unsub = vm.on('server-ready', (port, base) => {
			ready_unsub();
			callback(6 / 6, 'ready');
			fulfil(base); // this will be the last thing that happens if everything goes well
		});

		await run_dev();

		async function run_dev() {
			const process = await vm.run(
				{ command: 'turbo', args: ['run', 'dev'] },
				{
					stdout: (data) => {
						console.log(`[dev] ${data}`);
					},
					stderr: (data) => {
						vite_error = true;
						console.error(`[dev] ${data}`);
					}
				}
			);
			// keep restarting dev server (can crash in case of illegal +files for example)
			process.onExit.then((code) => {
				if (code !== 0) {
					setTimeout(() => {
						run_dev();
					}, 2000);
				}
			});
		}
	});

	return {
		base,
		reset: async (stubs) => {
			await running;
			/** @type {Function} */
			let resolve = () => {};
			running = new Promise((fulfil) => (resolve = fulfil));
			vite_error = false;

			let added_new_file = false;

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

			const to_delete = Array.from(current_stubs.keys());
			current_stubs = stubs_to_map(stubs);

			// For some reason, server-ready is fired again when the vite dev server is restarted.
			// We need to wait for it to finish before we can continue, else we might
			// request files from Vite before it's ready, leading to a timeout.
			const will_restart = will_restart_vite_dev_server(to_write);
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

			await vm.loadFiles(convert_stubs_to_tree(to_write));
			await promise;
			await new Promise((f) => setTimeout(f, 200)); // wait for chokidar

			resolve();

			// Also trigger a reload of the iframe in case new files were added / old ones deleted,
			// because that can result in a broken UI state
			return will_restart || vite_error || to_delete.length > 0 || added_new_file;
		},
		update: async (stubs) => {
			await running;

			/** @type {import('@webcontainer/api').FileSystemTree} */
			const root = {};

			for (const stub of stubs) {
				let tree = root;

				const path = stub.name.split('/').slice(1);
				const basename = /** @type {string} */ (path.pop());

				for (const part of path) {
					if (!tree[part]) {
						/** @type {import('@webcontainer/api').FileSystemTree} */
						const directory = {};

						tree[part] = {
							directory
						};
					}

					tree = /** @type {import('@webcontainer/api').DirectoryEntry} */ (tree[part]).directory;
				}

				tree[basename] = to_file(stub);
			}

			await vm.loadFiles(root);

			stubs_to_map(stubs, current_stubs);

			await new Promise((f) => setTimeout(f, 200)); // wait for chokidar

			return will_restart_vite_dev_server(stubs);
		},
		destroy: async () => {
			vm.teardown();
			// @ts-ignore
			vm = null;
		}
	};
}

/**
 * @param {import('$lib/types').Stub[]} stubs
 */
function will_restart_vite_dev_server(stubs) {
	return stubs.some(
		(stub) =>
			stub.type === 'file' &&
			(stub.name === '/vite.config.js' ||
				stub.name === '/svelte.config.js' ||
				stub.name === '/.env')
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

/** @param {import('$lib/types').FileStub} stub */
function to_file(stub) {
	// special case
	if (stub.name === '/src/app.html') {
		const contents = stub.contents.replace(
			'</head>',
			'<script type="module" src="/src/__client.js"></script></head>'
		);

		return {
			file: { contents }
		};
	}

	const contents = stub.text ? stub.contents : base64.toByteArray(stub.contents);

	return {
		file: { contents }
	};
}

/**
 * @param {import('$lib/types').Stub[]} stubs
 * @returns {Map<string, import('$lib/types').Stub>}
 */
function stubs_to_map(stubs, map = new Map()) {
	for (const stub of stubs) {
		map.set(stub.name, stub);
	}
	return map;
}
