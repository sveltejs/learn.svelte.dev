<script>
	import { createEventDispatcher } from 'svelte';
	import { open } from './ContextMenu.svelte';

	/** @type {boolean} */
	export let can_rename;

	/** @type {boolean} */
	export let renaming;

	/** @type {string} */
	export let basename;

	/** @type {import('./ContextMenu.svelte').MenuItem[]} */
	export let actions;

	const dispatch = createEventDispatcher();

	/** @param {Event} e */
	function commit(e) {
		const input = /** @type {HTMLInputElement} */ (e.target);
		if (input.value && input.value !== basename) {
			dispatch('rename', { basename: input.value });
		} else {
			cancel();
		}
	}

	function cancel() {
		dispatch('cancel');
	}
</script>

{#if renaming}
	<!-- svelte-ignore a11y-autofocus -->
	<input
		class="basename"
		type="text"
		autofocus
		autocomplete="off"
		spellcheck="false"
		value={basename}
		on:blur={(e) => {
			if (!renaming) return;
			commit(e);
		}}
		on:keyup={(e) => {
			if (e.key === 'Enter') {
				commit(e);
			}

			if (e.key === 'Escape') {
				cancel();
			}
		}}
	/>
{:else}
	<button
		class="basename"
		on:click
		on:dblclick={() => {
			if (can_rename) {
				dispatch('edit');
			}
		}}
		on:contextmenu|preventDefault={(e) => {
			open(e.clientX, e.clientY, actions);
		}}
	>
		{basename}
	</button>

	<div class="actions">
		{#each actions as action}
			<button aria-label={action.label} class="icon {action.icon}" on:click={action.fn} />
		{/each}
	</div>
{/if}

<style>
	input {
		color: var(--text) !important;
	}

	.actions {
		position: absolute;
		display: flex;
		right: -1px;
		top: 0;
		height: 100%;
		background-color: var(--bg);
		white-space: pre;
	}

	.actions::before {
		content: '';
		position: absolute;
		width: 1rem;
		height: 100%;
		left: -1rem;
		top: 0;
		background: linear-gradient(to right, transparent, var(--bg));
	}
</style>
