<script>
	import * as context from './context.js';
	import Item from './Item.svelte';
	import file_icon from '$lib/icons/file.svg';
	import { selected_name, solution } from '../state.js';

	/** @type {import('$lib/types').FileStub} */
	export let file;

	/** @type {number} */
	export let depth;

	const { rename, remove, select } = context.get();

	let renaming = false;

	$: can_remove = !$solution[file.name];

	/** @type {import('./ContextMenu.svelte').MenuItems} */
	$: actions = can_remove
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
		: [];
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
