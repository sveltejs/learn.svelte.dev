import { load } from '@webcontainer/api';

import base64 from 'base64-js';
import { ready } from '../common/index.js';

const WebContainer = await load();

/**
 * @param {import('$lib/types').Stub[]} stubs
 * @returns {Promise<import('$lib/types').Adapter>}
 */
export async function create(stubs) {
	const tree = convert_stubs_to_tree(stubs);

	const common = await ready;
	tree['common.zip'] = file(new Uint8Array(common.zipped));
	tree['boot.cjs'] = file(common.boot);

	const vm = await WebContainer.boot();
	await vm.loadFiles(tree);

	const boot = await vm.run(
		{
			command: 'node',
			args: ['boot.cjs']
		},
		{
			stderr: (data) => console.error(`[boot] ${data}`)
		}
	);

	const code = await boot.onExit;

	if (code !== 0) {
		throw new Error('Failed to initialize WebContainer');
	}

	const base = await new Promise(async (fulfil, reject) => {
		vm.on('server-ready', (port, base) => {
			fulfil(base);
		});

		await vm.run(
			{ command: 'turbo', args: ['run', 'dev'] },
			{
				stderr: (data) => console.error(`[dev] ${data}`)
			}
		);
	});

	let current = stubs;

	return {
		base,

		/** @param {import('$lib/types').Stub[]} stubs */
		async reset(stubs) {
			const old = new Set(current.filter((stub) => stub.type === 'file').map((stub) => stub.name));
			current = stubs;

			for (const stub of stubs) {
				if (stub.type === 'file') {
					old.delete(stub.name);
				}
			}

			for (const file of old) {
				// TODO this fails with a cryptic error
				// index.svelte:155 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'rmSync')
				// at Object.rm (webcontainer.e2e246a845f9e80283581d6b944116e399af6950.js:6:121171)
				// at MessagePort._0x4ec3f4 (webcontainer.e2e246a845f9e80283581d6b944116e399af6950.js:6:110957)
				// at MessagePort.nrWrapper (headless:5:29785)
				// await vm.fs.rm(file);

				// temporary workaround
				try {
					await vm.run({
						command: 'node',
						args: ['-e', `fs.rmSync('${file.slice(1)}')`]
					});
				} catch (e) {
					console.error(e);
				}
			}

			await vm.loadFiles(convert_stubs_to_tree(stubs));

			await new Promise((f) => setTimeout(f, 200)); // wait for chokidar
		},

		/** @param {import('$lib/types').FileStub[]} stubs */
		async update(stubs) {
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

				tree[basename] = file(stub.text ? stub.contents : base64.toByteArray(stub.contents));
			}

			await vm.loadFiles(root);

			await new Promise((f) => setTimeout(f, 200)); // wait for chokidar
		},

		async destroy() {
			vm.teardown();
		}
	};
}

/**
 * @param {import('$lib/types').Stub[]} stubs
 * @returns {import('@webcontainer/api').FileSystemTree}
 */
function convert_stubs_to_tree(stubs, depth = 1) {
	/** @type {import('@webcontainer/api').FileSystemTree} */
	const tree = {};

	for (const stub of stubs) {
		if (stub.depth === depth) {
			if (stub.type === 'directory') {
				const children = stubs.filter((child) => child.name.startsWith(stub.name));

				tree[stub.basename] = {
					directory: convert_stubs_to_tree(children, depth + 1)
				};
			} else {
				tree[stub.basename] = file(stub.text ? stub.contents : base64.toByteArray(stub.contents));
			}
		}
	}

	return tree;
}

/** @param {string | Uint8Array} contents */
function file(contents) {
	return {
		file: { contents }
	};
}
