<script>
	import { getContext } from 'svelte';
	import { open } from './ContextMenu.svelte';

	/** @type {import('$lib/types').FileStub} */
	export let file;
	export let read_only = false;
	export let can_create = true;
	export let can_remove = true;

	/** @type {import('$lib/types').FileTreeContext} */
	const { select, selected, edit, remove } = getContext('filetree');

	const restricted = new Set([
		'package.json',
		'vite.config.js',
		'svelte.config.js',
		'favicon.png',
		'app.html'
	]);

	let editing = false;
	let new_name = '';

	/** @param {MouseEvent} e */
	function open_menu(e) {
		if (restricted.has(file.basename) || read_only || !can_remove) {
			return;
		}

		/** @type {import('./ContextMenu.svelte').MenuItems} */
		const actions = [];
		if (can_create && can_remove) {
			actions.push({
				name: 'Rename',
				action: () => {
					new_name = file.basename;
					editing = true;
				}
			});
		}
		if (can_remove) {
			actions.push({
				name: 'Delete',
				action: () => {
					remove(file);
				}
			});
		}
		open(e.clientX, e.clientY, actions);
	}

	/** @param {Event} e */
	function done(e) {
		if (/** @type {KeyboardEvent} */ (e).key === 'Escape') {
			editing = false;
			new_name = '';
			return;
		}

		if ('key' in e && /** @type {KeyboardEvent} */ (e).key !== 'Enter') {
			return;
		}

		if (new_name) {
			edit(file, new_name);
		}

		new_name = '';
		editing = false;
	}
</script>

{#if !editing}
	<button
		class:selected={file === $selected}
		on:click={() => select(file)}
		on:contextmenu|preventDefault={open_menu}
	>
		{file.basename}
	</button>
{:else}
	<!-- svelte-ignore a11y-autofocus -->
	<input type="text" autofocus bind:value={new_name} on:blur={done} on:keyup={done} />
{/if}

<style>
	button {
		position: relative;
		padding: 0 0 0 0.2em;
		font-size: 1.6rem;
		font-family: inherit;
		color: var(--text);
		width: 100%;
		text-align: left;
		border: 2px solid transparent;
		white-space: nowrap;
	}

	button.selected {
		color: var(--prime);
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

	button:focus-visible {
		outline: none;
		border: 2px solid var(--flash);
	}
</style>
