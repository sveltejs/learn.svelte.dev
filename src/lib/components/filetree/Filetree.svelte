<script>
	import { createEventDispatcher } from 'svelte';
	import Folder from './Folder.svelte';
	import * as context from './context.js';
	import Modal from '../Modal.svelte';

	/** @type {import('svelte/store').Writable<import('$lib/types').Stub[]>} */
	export let files;

	/** @type {import('svelte/store').Writable<Record<string, import('$lib/types').Stub>>} */
	export let endstate;

	/** @type {{ prefix: string, depth: number, name: string }} */
	export let scope;

	/** @type {boolean} */
	export let readonly;

	/** @type {import('svelte/store').Writable<import('$lib/types').EditingConstraints>} */
	export let constraints;

	/** @type {import('svelte/store').Writable<import('$lib/types').FileStub | null> }*/
	export let selected;

	let modal_text = '';

	const dispatch = createEventDispatcher();

	const hidden = new Set(['__client.js', 'node_modules']);

	context.set({
		endstate,
		files,
		selected,

		select: async (file) => {
			selected.set(file);
		},

		add: async (name, type) => {
			if (!$endstate[name]) {
				modal_text =
					'Only the following files and folders are allowed to be created in this exercise:\n' +
					$constraints.create.join('\n');
				return;
			}

			const new_stubs = add_stub(name, type, $files);

			if (type === 'file') {
				const file = /** @type {import('$lib/types').FileStub} */ (new_stubs.at(-1));
				selected.set(file);
			}

			$files = [...$files, ...new_stubs];

			dispatch('change');
		},

		edit: async (to_rename, new_name) => {
			const new_full_name = to_rename.name.slice(0, -to_rename.basename.length) + new_name;

			console.log({ to_rename, new_name, new_full_name });

			if ($files.some((s) => s.name === new_full_name)) {
				modal_text = `A file or folder named ${new_full_name} already exists`;
				return;
			}

			if (!$endstate[new_full_name]) {
				modal_text =
					'Only the following files and folders are allowed to be created in this exercise:\n' +
					$constraints.create.join('\n');
				return;
			}

			if ($endstate[to_rename.name]) {
				modal_text =
					'Only the following files and folders are allowed to be removed in this exercise:\n' +
					$constraints.remove.join('\n');
				return;
			}

			if (to_rename.type === 'directory') {
				for (const stub of $files) {
					if (stub.name.startsWith(to_rename.name + '/')) {
						stub.name = new_full_name + stub.name.slice(to_rename.name.length);
					}
				}
			}

			to_rename.basename = /** @type {string} */ (new_name.split('/').pop());
			to_rename.name = new_full_name;

			$files = $files;

			dispatch('change');
		},

		remove: async (stub) => {
			if ($endstate[stub.name]) {
				modal_text =
					'Only the following files and folders are allowed to be deleted in this tutorial chapter:\n' +
					$constraints.remove.join('\n');
				return;
			}

			selected.set(null);

			$files = $files.filter((s) => {
				if (s === stub) return false;
				if (s.name.startsWith(stub.name + '/')) return false;
				return true;
			});

			dispatch('change');
		}
	});

	/**
	 * @param {string} name
	 * @param {'file' | 'directory'} type
	 * @param {import('$lib/types').Stub[]} current
	 */
	function add_stub(name, type, current) {
		// find directory which contains the new file
		/** @type {import('$lib/types').DirectoryStub} */
		let dir = /** @type {any} we know it will be assigned after the loop */ (null);
		for (const stub of current) {
			if (
				stub.type === 'directory' &&
				name.startsWith(stub.name) &&
				(!dir || dir.name.length < stub.name.length)
			) {
				dir = stub;
			}
		}

		const new_name = name.slice(dir.name.length + 1);
		const prefix = dir.name + '/';
		const parts = new_name.split('/');
		/** @type {import('$lib/types').Stub[]} */
		const stubs = [];

		for (let i = 1; i <= parts.length; i++) {
			const part = parts.slice(0, i).join('/');
			const basename = /** @type{string} */ (part.split('/').pop());
			const name = prefix + part;
			if (!current.some((s) => s.name === name)) {
				if (i < parts.length || type === 'directory') {
					stubs.push({ type: 'directory', name, basename });
				} else if (i === parts.length && type === 'file') {
					stubs.push({
						type: 'file',
						name,
						basename,
						text: true,
						contents: ''
					});
				}
			}
		}

		return stubs;
	}
</script>

<div class="filetree">
	<Folder
		prefix={scope.prefix}
		depth={scope.depth}
		name={scope.name}
		directory={{
			type: 'directory',
			name: '',
			basename: scope.name
		}}
		files={$files.filter((stub) => !hidden.has(stub.basename))}
		{readonly}
		expanded
	/>
</div>

{#if modal_text}
	<Modal on:close={() => (modal_text = '')}>
		<div class="modal-contents">
			<h2>This action is not allowed</h2>
			<p>{modal_text}</p>
			<button on:click={() => (modal_text = '')}>OK</button>
		</div>
	</Modal>
{/if}

<style>
	.filetree {
		--font-size: 1.4rem;
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 2rem;
	}

	.filetree::before {
		content: '';
		position: absolute;
		width: 0;
		height: 100%;
		top: 0;
		right: 0;
		border-right: 1px solid var(--border-color);
	}

	.filetree :global(.row) {
		--bg: white;
		position: relative;
		width: calc(100% - 1px);
		height: 1.4em;
		z-index: 1;
	}

	.filetree :global(.row::before) {
		content: '';
		position: absolute;
		right: 0;
		left: -20rem;
		height: 1.4em;
		background: var(--bg);
		z-index: -1;
	}

	.filetree :global(.row:hover) {
		--bg: var(--back-light);
	}

	.filetree :global(.actions) {
		position: absolute;
		display: flex;
		right: -2rem;
		top: 0;
		height: 100%;
		background-color: var(--bg);
		padding-right: 2rem;
		white-space: pre;
	}

	.filetree :global(.basename) {
		position: relative;
		padding: 0 0 0 0.2em;
		margin: 0;
		font-size: var(--font-size);
		font-family: inherit;
		color: var(--text);
		width: 100%;
		text-align: left;
		border: 2px solid transparent;
		white-space: nowrap;
	}

	.filetree :global(button),
	.filetree :global(input) {
		background-size: 1.2rem 1.2rem;
		background-position: 0 45%;
		background-repeat: no-repeat;
	}

	.filetree :global(input.basename) {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.filetree :global(:focus-visible) {
		outline: none;
		border: 2px solid var(--flash) !important;
	}

	.filetree :global(.icon) {
		height: 100%;
		width: 1.5rem;
	}

	.modal-contents p {
		white-space: pre-line;
	}

	.modal-contents button {
		display: block;
		background: var(--prime);
		color: white;
		padding: 1rem;
		width: 10em;
		margin: 1em 0 0 0;
		border-radius: var(--border-r);
		line-height: 1;
	}
</style>
