<script>
	import { createEventDispatcher } from 'svelte';
	import { open } from './ContextMenu.svelte';

	export let basename = '';

	/** @type {boolean} */
	export let can_rename = false;

	/** @type {boolean} */
	export let renaming;

	/** @type {import('./ContextMenu.svelte').MenuItem[]} */
	export let actions = [];

	const dispatch = createEventDispatcher();

	let cancelling = false;

	/** @param {Event} e */
	function commit(e) {
		const input = /** @type {HTMLInputElement} */ (e.target);
		if (input.value && input.value !== basename) {
			dispatch('rename', { basename: input.value });
		}

		cancel();
	}

	function cancel() {
		cancelling = true;
		dispatch('cancel');
		cancelling = false;
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
			if (!cancelling) return;
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

	{#if actions.length > 0}
		<div class="actions">
			{#each actions as action}
				<button aria-label={action.label} class="icon {action.icon}" on:click={action.fn} />
			{/each}
		</div>
	{/if}
{/if}

<style>
	input {
		background: var(--sk-back-1);
		color: var(--sk-text-1) !important;
	}

	.basename {
		position: relative;
		margin: 0;
		font-size: var(--font-size);
		font-family: inherit;
		color: inherit;
		width: calc(100% + 2rem);
		text-align: left;
		border: 2px solid transparent;
		white-space: nowrap;
		overflow: hidden;
	}

	input {
		width: 100%;
		height: 100%;
	}

	.actions {
		position: absolute;
		display: flex;
		right: -1rem;
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

	.actions::after {
		content: '';
		position: absolute;
		width: 1rem;
		height: 100%;
		right: calc(-1rem + 1px);
		top: 0;
		background: var(--sk-back-1);
	}

	.icon {
		height: 100%;
		width: 1.5rem;
	}

	.icon.rename {
		background-image: url(../../../../lib/icons/rename.svg);
	}

	.icon.delete {
		background-image: url(../../../../lib/icons/delete.svg);
	}

	.icon.file-new {
		background-image: url(../../../../lib/icons/file-new.svg);
	}

	.icon.folder-new {
		background-image: url(../../../../lib/icons/folder-new.svg);
	}
</style>
