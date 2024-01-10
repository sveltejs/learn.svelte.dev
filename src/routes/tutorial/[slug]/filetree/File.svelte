<script>
	import * as context from './context.js';
	import Item from './Item.svelte';
	import file_icon from '$lib/icons/file.svg';
	import { selected_name, solution } from '../state.js';

	/** @type {{ file: import('$lib/types').FileStub; depth: number }} */
	let { file, depth } = $props();

	const { rename, remove, select } = context.get();

	let renaming = $state(false);

	const can_remove = $derived(!$solution[file.name]);

	/** @type {import('./ContextMenu.svelte').MenuItem[]} */
	const actions = $derived(
		can_remove
			? [
					{
						icon: 'rename',
						label: 'Rename',
						fn: () => {
							renaming = true;
						}
					},
					{
						icon: 'delete',
						label: 'Delete',
						fn: () => {
							remove(file);
						}
					}
			  ]
			: []
	);
</script>

<Item
	{depth}
	can_rename={can_remove}
	{renaming}
	basename={file.basename}
	icon={file_icon}
	selected={file.name === $selected_name}
	{actions}
	on:click={() => select(file.name)}
	on:edit={() => {
		renaming = true;
	}}
	on:rename={(e) => {
		rename(file, e.detail.basename);
	}}
	on:cancel={() => {
		renaming = false;
	}}
/>
