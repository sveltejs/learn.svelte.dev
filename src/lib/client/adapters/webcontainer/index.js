import { load } from '@webcontainer/api';

const WebContainer = await load();

/**
 * @param {import('$lib/types').Stub[]} stubs
 * @returns {Promise<import('$lib/types').Adapter>}
 */
export async function create(stubs) {
	const vm = await WebContainer.boot();

	const tree = convert_stubs_to_tree(stubs);
	await vm.loadFiles(tree);

	const base = await new Promise(async (fulfil, reject) => {
		vm.on('server-ready', (port, base) => {
			fulfil(base);
		});

		const install = await vm.run(
			{
				command: 'turbo',
				args: ['install']
			},
			{
				stdout: (data) => console.log(data),
				stderr: (data) => console.error(data)
			}
		);

		const code = await install.onExit;

		if (code !== 0) {
			reject(new Error('Installation failed'));
			return;
		}

		console.log('installation succeeded');

		await vm.run(
			{ command: 'turbo', args: ['run', 'dev', '--port', '3005', '--host'] },
			{
				stdout: (data) => console.log(data),
				stderr: (data) => console.error(data)
			}
		);
	});

	return {
		base,

		/** @param {import('$lib/types').Stub[]} stubs */
		async reset(stubs) {
			// TODO
			await new Promise((f) => setTimeout(f, 100)); // wait for chokidar
		},

		/** @param {import('$lib/types').Stub[]} stubs */
		async update(stubs) {
			// TODO
			await new Promise((f) => setTimeout(f, 100)); // wait for chokidar
		},

		async destroy() {
			// TODO
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
				tree[stub.basename] = {
					file: {
						contents: stub.text ? stub.contents : atob(stub.contents) // errr... how do we turn a base64 string back into a Uint8Array?
					}
				};
			}
		}
	}

	return tree;
}
