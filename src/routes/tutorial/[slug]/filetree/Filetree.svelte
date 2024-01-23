<script>
	import Folder from './Folder.svelte';
	import * as context from './context.js';
	import Modal from '$lib/components/Modal.svelte';
	import { reset_files, create_directories, s } from '../state.svelte.js';
	import { afterNavigate } from '$app/navigation';

	/** @type {{exercise: import('$lib/types').Exercise; mobile?: boolean; on_select?: (name: string | null) => void;}} */
	let { exercise, mobile = false, on_select } = $props();

	const hidden = new Set(['__client.js', 'node_modules', '__delete']);

	let modal_text = $state('');

	/** @type {context.FileTreeContext} */
	const context_state = $state({
		collapsed: {},

		add: async (name, type) => {
			const expected = s.solution[name];

			if (expected && type !== expected.type) {
				modal_text = `${name.slice(exercise.scope.prefix.length)} should be a ${
					expected.type
				}, not a ${type}!`;
				return;
			}

			if (!expected && !exercise.editing_constraints.create.has(name)) {
				modal_text =
					'Only the following files and folders are allowed to be created in this exercise:\n' +
					Array.from(exercise.editing_constraints.create).join('\n');
				return;
			}

			const existing = s.files.find((file) => file.name === name);
			if (existing) {
				modal_text = `A ${existing.type} already exists with this name`;
				return;
			}

			const basename = /** @type {string} */ (name.split('/').pop());

			/** @type {import('$lib/types').Stub} */
			const file =
				type === 'file'
					? { type, name, basename, text: true, contents: '' }
					: { type, name, basename };

			reset_files([...s.files, ...create_directories(name, s.files), file]);

			if (type === 'file') {
				on_select?.(name);
			}
		},

		rename: async (to_rename, new_name) => {
			const new_full_name = to_rename.name.slice(0, -to_rename.basename.length) + new_name;

			if (s.files.some((f) => f.name === new_full_name)) {
				modal_text = `A file or folder named ${new_full_name} already exists`;
				return;
			}

			if (!s.solution[new_full_name] && !exercise.editing_constraints.create.has(new_full_name)) {
				modal_text =
					'Only the following files and folders are allowed to be created in this exercise:\n' +
					Array.from(exercise.editing_constraints.create).join('\n');
				return;
			}

			if (s.solution[to_rename.name] && !exercise.editing_constraints.remove.has(to_rename.name)) {
				modal_text =
					'Only the following files and folders are allowed to be removed in this exercise:\n' +
					Array.from(exercise.editing_constraints.remove).join('\n');
				return;
			}

			if (to_rename.type === 'directory') {
				for (const file of s.files) {
					if (file.name.startsWith(to_rename.name + '/')) {
						file.name = new_full_name + file.name.slice(to_rename.name.length);
					}
				}
			}

			const was_selected = s.selected_name === to_rename.name;

			to_rename.basename = /** @type {string} */ (new_full_name.split('/').pop());
			to_rename.name = new_full_name;

			reset_files([...s.files, ...create_directories(new_full_name, s.files)]);

			if (was_selected) {
				on_select?.(new_full_name);
			}
		},

		remove: async (file) => {
			if (s.solution[file.name] && !exercise.editing_constraints.remove.has(file.name)) {
				modal_text =
					'Only the following files and folders are allowed to be deleted in this tutorial chapter:\n' +
					Array.from(exercise.editing_constraints.remove).join('\n');
				return;
			}

			on_select?.(null);

			reset_files(
				s.files.filter((f) => {
					if (f === file) return false;
					if (f.name.startsWith(file.name + '/')) return false;
					return true;
				})
			);
		},

		select: (name) => {
			on_select?.(name);
		}
	});

	afterNavigate(() => {
		context_state.collapsed = {};
	});

	// svelte-ignore static-state-reference
	context.set(context_state);

	/** @param {import('$lib/types').Stub} file */
	function is_deleted(file) {
		if (file.type === 'directory') return `${file.name}/__delete` in exercise.a;
		if (file.text) return file.contents.startsWith('__delete');

		return false;
	}
</script>

<ul
	class="filetree"
	class:mobile
	onkeydown={(e) => {
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
		contents={s.files.filter((file) => !hidden.has(file.basename) && !is_deleted(file))}
	/>
</ul>

{#if modal_text}
	<Modal onclose={() => (modal_text = '')}>
		<div class="modal-contents">
			<h2>This action is not allowed</h2>
			<p>{modal_text}</p>
			<button onclick={() => (modal_text = '')}>OK</button>
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
