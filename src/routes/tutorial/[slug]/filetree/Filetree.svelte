<script>
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import Folder from './Folder.svelte';
	import * as context from './context.js';
	import Modal from '$lib/components/Modal.svelte';
	import { files, solution, reset_files, select_file } from '../state.js';
	import { afterNavigate } from '$app/navigation';

	/** @type {import('$lib/types').Exercise} */
	export let exercise;

	export let mobile = false;

	const dispatch = createEventDispatcher();

	const hidden = new Set(['__client.js', 'node_modules']);

	let modal_text = '';

	/** @type {import('svelte/store').Writable<Record<string, boolean>>}*/
	const collapsed = writable({});

	afterNavigate(() => {
		collapsed.set({});
	});

	context.set({
		collapsed,

		add: async (name, type) => {
			if (!$solution[name] && !exercise.editing_constraints.create.has(name)) {
				modal_text =
					'Only the following files and folders are allowed to be created in this exercise:\n' +
					Array.from(exercise.editing_constraints.create).join('\n');
				return;
			}

			const existing = $files.find((file) => file.name === name);
			if (existing) {
				modal_text = `A ${existing.type} already exists with this name`;
				return;
			}

			const basename = /** @type {string} */ (name.split('/').pop());

			/** @type {import('$lib/types').Stub} */
			let file;

			if (type === 'file') {
				file = {
					type: 'file',
					name,
					basename,
					text: true,
					contents: ''
				};

				select_file(file.name);
			} else {
				file = { type: 'directory', name, basename };
			}

			reset_files([...$files, ...create_directories(name, $files), file]);
		},

		rename: async (to_rename, new_name) => {
			const new_full_name = to_rename.name.slice(0, -to_rename.basename.length) + new_name;

			if ($files.some((f) => f.name === new_full_name)) {
				modal_text = `A file or folder named ${new_full_name} already exists`;
				return;
			}

			if (!$solution[new_full_name] && !exercise.editing_constraints.create.has(new_full_name)) {
				modal_text =
					'Only the following files and folders are allowed to be created in this exercise:\n' +
					Array.from(exercise.editing_constraints.create).join('\n');
				return;
			}

			if ($solution[to_rename.name] && !exercise.editing_constraints.remove.has(to_rename.name)) {
				modal_text =
					'Only the following files and folders are allowed to be removed in this exercise:\n' +
					Array.from(exercise.editing_constraints.remove).join('\n');
				return;
			}

			if (to_rename.type === 'directory') {
				for (const file of $files) {
					if (file.name.startsWith(to_rename.name + '/')) {
						file.name = new_full_name + file.name.slice(to_rename.name.length);
					}
				}
			}

			to_rename.basename = /** @type {string} */ (new_full_name.split('/').pop());
			to_rename.name = new_full_name;

			reset_files([...$files, ...create_directories(new_full_name, $files)]);
		},

		remove: async (file) => {
			if ($solution[file.name] && !exercise.editing_constraints.remove.has(file.name)) {
				modal_text =
					'Only the following files and folders are allowed to be deleted in this tutorial chapter:\n' +
					Array.from(exercise.editing_constraints.remove).join('\n');
				return;
			}

			select_file(null);
			reset_files(
				$files.filter((f) => {
					if (f === file) return false;
					if (f.name.startsWith(file.name + '/')) return false;
					return true;
				})
			);
		},

		select: (name) => {
			dispatch('select');
			select_file(name);
		}
	});

	/**
	 * @param {string} name
	 * @param {import('$lib/types').Stub[]} files
	 */
	function create_directories(name, files) {
		const existing = new Set();

		for (const file of files) {
			if (file.type === 'directory') {
				existing.add(file.name);
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

<ul
	class="filetree"
	class:mobile
	on:keydown={(e) => {
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			e.preventDefault();
			const lis = Array.from(e.currentTarget.querySelectorAll('li'));
			const focused = lis.findIndex((li) => li.contains(e.target));

			const d = e.key === 'ArrowUp' ? -1 : +1;

			lis[focused + d]?.querySelector('button')?.focus();
		}
	}}
>
	<Folder
		prefix={exercise.scope.prefix}
		depth={0}
		directory={{
			type: 'directory',
			name: '',
			basename: exercise.scope.name
		}}
		contents={$files.filter((file) => !hidden.has(file.basename))}
	/>
</ul>

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
		padding: 1rem 0rem;
		margin: 0;
		background: var(--sk-back-1);
		list-style: none;
	}

	.filetree.mobile {
		height: 100%;
	}

	.filetree:not(.mobile)::before {
		content: '';
		position: absolute;
		width: 0;
		height: 100%;
		top: 0;
		right: 0;
		border-right: 1px solid var(--sk-back-4);
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
