<script>
	import * as context from './context.js';
	import Item from './Item.svelte';
	import file_icon from '$lib/icons/file.svg';
	import { s } from '../state.svelte.js';

	/** @type {{ file: import('$lib/types').FileStub; depth: number }} */
	let { file, depth } = $props();

	const { rename, remove, select } = context.get();

	let renaming = $state(false);

	const can_remove = $derived(!s.solution[file.name]);

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
	selected={file.name === s.selected_name}
	{actions}
	onclick={() => select(file.name)}
	on_edit={() => {
		renaming = true;
	}}
	on_rename={(basename) => {
		rename(file, basename);
	}}
	on_cancel={() => {
		renaming = false;
	}}
/>
