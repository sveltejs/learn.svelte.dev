<script>
	import { createEventDispatcher } from 'svelte';
	import Folder from './Folder.svelte';
	import * as context from './context.js';

	/** @type {import('$lib/types').Stub[]} */
	export let files;

	/** @type {{ prefix: string, depth: number, name: string }} */
	export let scope;

	/** @type {boolean} */
	export let readonly;

	/** @type {import('$lib/types').EditingConstraints} */
	export let constraints;

	/** @type {import('svelte/store').Writable<import('$lib/types').FileStub | null> }*/
	export let selected;

	const dispatch = createEventDispatcher();

	context.set({
		select: async (file) => {
			selected.set(file);
		},

		add: async (name, type) => {
			dispatch('add', { name, type });
		},

		edit: async (to_rename, new_name) => {
			dispatch('edit', { to_rename, new_name });
		},

		remove: async (stub) => {
			dispatch('remove', { stub });
		},

		selected
	});
</script>

<div class="filetree">
	<Folder
		prefix={scope.prefix}
		depth={scope.depth}
		name={scope.name}
		{files}
		{readonly}
		expanded
		can_create={!!constraints.create.length}
		can_remove={!!constraints.remove.length}
	/>
</div>

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
</style>
