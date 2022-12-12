<script>
	import { open } from './ContextMenu.svelte';
	import * as context from './context.js';

	/** @type {import('$lib/types').FileStub} */
	export let file;
	export let read_only = false;

	/** @type {number} */
	export let depth;

	const { selected, endstate, select, edit, remove } = context.get();

	/** @type {'idle' | 'renaming'} */
	let state = 'idle';

	$: can_remove = !read_only && !$endstate[file.name];

	/** @type {import('./ContextMenu.svelte').MenuItems} */
	$: actions = can_remove
		? [
				{
					name: 'rename',
					label: 'Rename',
					fn: () => {
						state = 'renaming';
					}
				},
				{
					name: 'delete',
					label: 'Delete',
					fn: () => {
						remove(file);
					}
				}
		  ]
		: [];

	/** @param {Event} e */
	function done(e) {
		if (state === 'idle') return;

		if (/** @type {KeyboardEvent} */ (e).key === 'Escape') {
			state = 'idle';
			return;
		}

		if ('key' in e && /** @type {KeyboardEvent} */ (e).key !== 'Enter') {
			return;
		}

		const input = /** @type {HTMLInputElement} */ (e.target);

		if (input.value && input.value !== file.basename) {
			edit(file, input.value);
		}

		state = 'idle';
	}
</script>

<div class="row" style="--depth: {depth};">
	{#if state === 'renaming'}
		<!-- svelte-ignore a11y-autofocus -->
		<input
			class="basename"
			type="text"
			autofocus
			autocomplete="off"
			spellcheck="false"
			value={file.basename}
			on:blur={done}
			on:keyup={done}
		/>
	{:else}
		<button
			class="basename"
			class:selected={file === $selected}
			on:click={() => select(file)}
			on:dblclick={() => {
				if (can_remove) state = 'renaming';
			}}
			on:contextmenu|preventDefault={(e) => {
				open(e.clientX, e.clientY, actions);
			}}
		>
			{file.basename}
		</button>

		<div class="actions">
			{#each actions as action}
				<button aria-label={action.label} class="icon {action.name}" on:click={action.fn} />
			{/each}
		</div>
	{/if}
</div>

<style>
	button.selected {
		color: var(--prime) !important;
	}

	button.selected::after {
		content: '';
		position: absolute;
		width: 1rem;
		height: 1rem;
		top: 0.1rem;
		right: calc(-2.6rem - 2px);
		background-color: var(--light-blue);
		border: 1px solid var(--border-color);
		transform: translate(0, 0.2rem) rotate(45deg);
		z-index: 2;
	}
</style>
