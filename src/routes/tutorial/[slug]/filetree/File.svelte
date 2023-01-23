<script>
	import * as context from './context.js';
	import Item from './Item.svelte';
	import { selected, solution, state } from '../state.js';

	/** @type {import('$lib/types').FileStub} */
	export let file;

	const { rename, remove, readonly } = context.get();

	/** @type {'idle' | 'renaming'} */
	let editing_state = 'idle';

	$: can_remove = !$readonly && !$solution[file.name];

	/** @type {import('./ContextMenu.svelte').MenuItems} */
	$: actions = can_remove
		? [
				{
					icon: 'rename',
					label: 'Rename',
					fn: () => {
						editing_state = 'renaming';
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

<div class="row" class:selected={file.name === $selected?.name}>
	<Item
		can_rename={can_remove}
		renaming={editing_state === 'renaming'}
		basename={file.basename}
		{actions}
		on:click={() => state.select_file(file.name)}
		on:edit={() => {
			editing_state = 'renaming';
		}}
		on:rename={(e) => {
			rename(file, e.detail.basename);
		}}
		on:cancel={() => {
			editing_state = 'idle';
		}}
	/>
</div>

<style>
	.selected {
		color: var(--prime) !important;
	}

	.selected::after {
		content: '';
		position: absolute;
		width: 1rem;
		height: 1rem;
		top: 0.1rem;
		right: calc(-2.6rem - 2px);
		background-color: var(--sk-back-1);
		border: 1px solid var(--sk-back-4);
		transform: translate(0, 0.2rem) rotate(45deg);
		z-index: 2;
	}
</style>
