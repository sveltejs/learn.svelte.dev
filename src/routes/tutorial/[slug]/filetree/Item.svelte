<script>
	import { createEventDispatcher, tick } from 'svelte';
	import { open } from './ContextMenu.svelte';

	export let basename = '';
	export let icon = '';
	export let depth = 0;

	export let selected = false;

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

	async function cancel() {
		cancelling = true;
		dispatch('cancel');
		await tick();
		cancelling = false;
	}
</script>

<li
	aria-current={selected ? 'true' : undefined}
	style="--depth: {depth}; --icon: url('{icon}');"
	on:keydown
>
	{#if renaming}
		<!-- svelte-ignore a11y-autofocus -->
		<input
			type="text"
			autofocus
			autocomplete="off"
			spellcheck="false"
			value={basename}
			on:blur={(e) => {
				if (!cancelling) {
					commit(e);
				}
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
</li>

<style>
	li {
		--bg: var(--sk-back-1);
		--inset: calc((var(--depth) * 1.2rem) + 1.5rem);
		display: flex;
		position: relative;
		width: calc(100% - 1px);
		height: 2.4rem;
		z-index: 1;
		background: var(--bg) var(--icon) no-repeat;
		background-position: calc(var(--inset) - 0.5rem) 50%;
		background-size: 1.2rem;
		color: var(--sk-text-2);
	}

	li:hover {
		--bg: var(--sk-back-3);
	}

	button,
	input {
		background-size: 1.2rem 1.2rem;
		background-position: 0 45%;
		background-repeat: no-repeat;
	}

	:focus-visible {
		outline: none;
		border: 2px solid var(--sk-theme-3) !important;
		border-radius: 2px;
	}

	input {
		background: var(--sk-back-1);
		color: var(--sk-text-1) !important;
		margin: 0 0.5rem 0 calc(0.5rem + var(--inset));
		padding: 0 0.5rem;
		font-size: var(--font-size);
		font-family: inherit;
	}

	.basename {
		display: block;
		position: relative;
		margin: 0;
		padding: 0 1rem 0 calc(1rem + var(--inset));
		font-size: var(--font-size);
		font-family: inherit;
		color: inherit;
		flex: 1;
		height: 100%;
		text-align: left;
		border: 2px solid transparent;
		white-space: nowrap;
		overflow: hidden;
		line-height: 1;
	}

	input {
		width: 100%;
		height: 100%;
	}

	.actions {
		display: flex;
		right: 0;
		top: 0;
		height: 100%;
		padding-right: 1rem;
		background-color: var(--bg);
		white-space: pre;
	}

	.icon {
		height: 100%;
		width: 1.5rem;
	}

	.icon.rename {
		background-image: url($lib/icons/rename.svg);
	}

	.icon.delete {
		background-image: url($lib/icons/delete.svg);
	}

	.icon.file-new {
		background-image: url($lib/icons/file-new.svg);
	}

	.icon.folder-new {
		background-image: url($lib/icons/folder-new.svg);
	}

	[aria-current='true'] {
		color: var(--prime);
	}

	[aria-current='true']::after {
		content: '';
		position: absolute;
		width: 1rem;
		height: 1rem;
		top: 0.3rem;
		right: calc(-0.6rem - 2px);
		background-color: var(--sk-back-3);
		border: 1px solid var(--sk-back-4);
		transform: translate(0, 0.2rem) rotate(45deg);
		z-index: 2;
	}

	[aria-current='true']:has(:focus-visible)::after,
	:global(.mobile-filetree) [aria-current='true']::after {
		display: none;
	}
</style>
