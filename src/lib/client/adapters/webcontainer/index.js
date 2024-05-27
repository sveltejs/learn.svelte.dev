import { WebContainer } from '@webcontainer/api';
import base64 from 'base64-js';
import AnsiToHtml from 'ansi-to-html';
import * as yootils from 'yootils';
import { escape_html, get_depth } from '../../../utils.js';
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
 * @param {import('svelte/store').Writable<Record<string, import('$lib/types').Warning[]>>} warnings
 * @returns {Promise<import('$lib/types').Adapter>}
 */
export async function create(base, error, progress, logs, warnings) {
	progress.set({ value: 0, text: 'loading files' });

	const q = yootils.queue(1);
	/** @type {Map<string, Array<import('$lib/types').FileStub>>} */
	const q_per_file = new Map();

	/** Paths and contents of the currently loaded file stubs */
	let current_stubs = stubs_to_map([]);

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

	/** @type {Record<string, import('$lib/types').Warning[]>} */
	let $warnings;
	warnings.subscribe((value) => ($warnings = value));

	/** @type {any} */
	let timeout;

	/** @param {number} msec */
	function schedule_to_update_warning(msec) {
		clearTimeout(timeout);
		timeout = setTimeout(() => warnings.set($warnings), msec);
	}

	const log_stream = () =>
		new WritableStream({
			write(chunk) {
				if (chunk === '\x1B[1;1H') {
					// clear screen
					logs.set([]);
				} else if (chunk?.startsWith('svelte:warnings:')) {
					/** @type {import('$lib/types').Warning} */
					const warn = JSON.parse(chunk.slice(16));
					const current = $warnings[warn.filename];

					if (!current) {
						$warnings[warn.filename] = [warn];
						// the exact same warning may be given multiple times in a row
					} else if (!current.some((s) => s.code === warn.code && s.pos === warn.pos)) {
						current.push(warn);
					}

					schedule_to_update_warning(100);
				} else {
					const log = converter.toHtml(escape_html(chunk)).replace(/\n/g, '<br>');
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
				const process = await vm.spawn('npm', ['run', 'dev']);

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
		reset: (stubs) => {
			return q.add(async () => {
				/** @type {import('$lib/types').Stub[]} */
				const to_write = [];

				const force_delete = [];

				for (const stub of stubs) {
					if (stub.name.endsWith('/__delete')) {
						force_delete.push(stub.name.slice(0, -9));
					} else if (stub.type === 'file') {
						if (stub.contents.startsWith('__delete')) {
							force_delete.push(stub.name);
							continue;
						}

						const current = /** @type {import('$lib/types').FileStub} */ (
							current_stubs.get(stub.name)
						);

						if (current?.contents !== stub.contents) {
							to_write.push(stub);
						}
					} else {
						// always add directories, otherwise convert_stubs_to_tree will fail
						to_write.push(stub);
					}

					current_stubs.delete(stub.name);
				}

				// Don't delete the node_modules folder when switching from one exercise to another
				// where, as this crashes the dev server.
				const to_delete = [
					...Array.from(current_stubs.keys()).filter((s) => !s.startsWith('/node_modules')),
					...force_delete
				];

				// initialize warnings of written files
				to_write
					.filter((stub) => stub.type === 'file' && $warnings[stub.name])
					.forEach((stub) => ($warnings[stub.name] = []));
				// remove warnings of deleted files
				to_delete
					.filter((stubname) => $warnings[stubname])
					.forEach((stubname) => delete $warnings[stubname]);

				warnings.set($warnings);

				current_stubs = stubs_to_map(stubs);

				// For some reason, server-ready is fired again when the vite dev server is restarted.
				// We need to wait for it to finish before we can continue, else we might
				// request files from Vite before it's ready, leading to a timeout.
				const will_restart =
					launched && (to_write.some(is_config) || to_delete.some(is_config_path));
				const promise = will_restart ? wait_for_restart_vite() : Promise.resolve();

				for (const file of to_delete) {
					await vm.fs.rm(file, { force: true, recursive: true });
				}

				await vm.mount(convert_stubs_to_tree(to_write));
				await promise;
				await new Promise((f) => setTimeout(f, 200)); // wait for chokidar

				// Also trigger a reload of the iframe in case new files were added / old ones deleted,
				// because that can result in a broken UI state
				const should_reload = !launched || will_restart || to_delete.length > 0;

				await launch();

				return should_reload;
			});
		},
		update: (file) => {
			let queue = q_per_file.get(file.name);
			if (queue) {
				queue.push(file);
				return Promise.resolve(false);
			}

			q_per_file.set(file.name, (queue = [file]));

			return q.add(async () => {
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

				const will_restart = is_config(file);

				while (queue && queue.length > 0) {
					// if the file is updated many times rapidly, get the most recently updated one
					const file = /** @type {import('$lib/types').FileStub} */ (queue.pop());
					queue.length = 0;

					tree[basename] = to_file(file);

					// initialize warnings of this file
					$warnings[file.name] = [];
					schedule_to_update_warning(100);

					await vm.mount(root);

					if (will_restart) await wait_for_restart_vite();

					current_stubs.set(file.name, file);

					// we need to stagger sequential updates, just enough that the HMR
					// wires don't get crossed. 50ms seems to be enough of a delay
					// to avoid glitches without noticeably affecting update speed
					await new Promise((f) => setTimeout(f, 50));
				}

				q_per_file.delete(file.name);

				return will_restart;
			});
		}
	};
}

/**
 * @param {import('$lib/types').Stub} file
 */
function is_config(file) {
	return file.type === 'file' && is_config_path(file.name);
}

/**
 * @param {string} path
 */
function is_config_path(path) {
	return ['/vite.config.js', '/svelte.config.js', '/.env'].includes(path);
}

function wait_for_restart_vite() {
	return new Promise((fulfil, reject) => {
		const error_unsub = vm.on('error', (error) => {
			error_unsub();
			reject(new Error(error.message));
		});

		const ready_unsub = vm.on('server-ready', (port, base) => {
			ready_unsub();
			console.log(`server ready on port ${port} at ${performance.now()}: ${base}`);
			fulfil(undefined);
		});

		setTimeout(() => {
			reject(new Error('Timed out resetting WebContainer'));
		}, 10000);
	});
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
	if (file.name === '/src/app.html' || file.name === '/src/error.html') {
		const contents = file.contents + '<script type="module" src="/src/__client.js"></script>';

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
