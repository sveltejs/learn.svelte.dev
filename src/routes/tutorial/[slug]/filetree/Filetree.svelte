<script>
	import Folder from './Folder.svelte';
	import * as context from './context.js';
	import Modal from '$lib/components/Modal.svelte';
	import { state, stubs, editing_constraints, solution, scope } from '../state.js';

	/** @type {import('svelte/store').Writable<boolean>} */
	export let readonly;

	let modal_text = '';

	const hidden = new Set(['__client.js', 'node_modules']);

	context.set({
		readonly,

		add: async (name, type) => {
			if (!$solution[name] && !$editing_constraints.create.includes(name)) {
				modal_text =
					'Only the following files and folders are allowed to be created in this exercise:\n' +
					$editing_constraints.create.join('\n');
				return;
			}

			const basename = /** @type {string} */ (name.split('/').pop());

			/** @type {import('$lib/types').Stub} */
			let stub;

			if (type === 'file') {
				stub = {
					type: 'file',
					name,
					basename,
					text: true,
					contents: ''
				};

				state.select_file(stub.name);
			} else {
				stub = { type: 'directory', name, basename };
			}

			state.set_stubs([...$stubs, ...create_directories(name, $stubs), stub]);
		},

		rename: async (to_rename, new_name) => {
			const new_full_name = to_rename.name.slice(0, -to_rename.basename.length) + new_name;

			if ($stubs.some((s) => s.name === new_full_name)) {
				modal_text = `A file or folder named ${new_full_name} already exists`;
				return;
			}

			if (!$solution[new_full_name] && !$editing_constraints.create.includes(new_full_name)) {
				modal_text =
					'Only the following files and folders are allowed to be created in this exercise:\n' +
					$editing_constraints.create.join('\n');
				return;
			}

			if ($solution[to_rename.name] && !$editing_constraints.remove.includes(to_rename.name)) {
				modal_text =
					'Only the following files and folders are allowed to be removed in this exercise:\n' +
					$editing_constraints.remove.join('\n');
				return;
			}

			if (to_rename.type === 'directory') {
				for (const stub of $stubs) {
					if (stub.name.startsWith(to_rename.name + '/')) {
						stub.name = new_full_name + stub.name.slice(to_rename.name.length);
					}
				}
			}

			to_rename.basename = /** @type {string} */ (new_full_name.split('/').pop());
			to_rename.name = new_full_name;

			state.set_stubs([...$stubs, ...create_directories(new_full_name, $stubs)]);
		},

		remove: async (stub) => {
			if ($solution[stub.name] && !$editing_constraints.remove.includes(stub.name)) {
				modal_text =
					'Only the following files and folders are allowed to be deleted in this tutorial chapter:\n' +
					$editing_constraints.remove.join('\n');
				return;
			}

			state.select_file(null);
			state.set_stubs(
				$stubs.filter((s) => {
					if (s === stub) return false;
					if (s.name.startsWith(stub.name + '/')) return false;
					return true;
				})
			);
		}
	});

	/**
	 * @param {string} name
	 * @param {import('$lib/types').Stub[]} stubs
	 */
	function create_directories(name, stubs) {
		const existing = new Set();

		for (const stub of stubs) {
			if (stub.type === 'directory') {
				existing.add(stub.name);
			}
		}

		/** @type {import('$lib/types').DirectoryStub[]} */
		const directories = [];

		const parts = name.split('/');
		while (parts.length) {
			parts.pop();

			const dir = parts.join('/');
			if (existing.has(dir)) {
				break;
			}

			directories.push({
				type: 'directory',
				name: dir,
				basename: /** @type {string} */ (parts.at(-1))
			});
		}

		return directories;
	}
</script>

<div class="filetree">
	<Folder
		prefix={$scope.prefix}
		depth={$scope.depth}
		directory={{
			type: 'directory',
			name: '',
			basename: $scope.name
		}}
		files={$stubs.filter((stub) => !hidden.has(stub.basename))}
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
		background: var(--sk-back-1);
	}

	.filetree::before {
		content: '';
		position: absolute;
		width: 0;
		height: 100%;
		top: 0;
		right: 0;
		border-right: 1px solid var(--sk-back-4);
	}

	.filetree :global(.row) {
		--bg: var(--sk-back-1);
		--inset: calc((var(--depth) * 1.2rem) + 1.5rem);
		position: relative;
		width: calc(100% - 1px);
		padding: 0 0 0 var(--inset);
		height: 1.4em;
		z-index: 1;
		background: var(--bg);
		color: var(--sk-text-2);
	}

	.filetree :global(.row:hover) {
		--bg: var(--sk-back-3);
	}

	.filetree :global(button),
	.filetree :global(input) {
		background-size: 1.2rem 1.2rem;
		background-position: 0 45%;
		background-repeat: no-repeat;
	}

	.filetree :global(:focus-visible) {
		outline: none;
		border: 2px solid var(--sk-theme-3) !important;
	}

	.modal-contents p {
		white-space: pre-line;
	}

	.modal-contents button {
		display: block;
		background: var(--sk-theme-1);
		color: white;
		padding: 1rem;
		width: 10em;
		margin: 1em 0 0 0;
		border-radius: var(--sk-border-radius);
		line-height: 1;
	}
</style>
