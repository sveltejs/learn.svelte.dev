<script>
	import { open } from './ContextMenu.svelte';
	import * as context from './context.js';

	/** @type {import('$lib/types').FileStub} */
	export let file;
	export let read_only = false;
	export let can_create = true;
	export let can_remove = true;

	const { select, selected, edit, remove } = context.get();

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
	<div class="file-row">
		<button
			class:selected={file === $selected}
			on:click={() => select(file)}
			on:contextmenu|preventDefault={open_menu}
		>
			{file.basename}
		</button>
		<div class="file-actions">
			{#if can_create && can_remove}
				<button
					aria-label="Rename"
					class="icon rename"
					on:click={() => {
						new_name = file.basename;
						editing = true;
					}}
				/>
			{/if}
			{#if can_remove}
				<button aria-label="Delete" class="icon delete" on:click={() => remove(file)} />
			{/if}
		</div>
	</div>
{:else}
	<!-- svelte-ignore a11y-autofocus -->
	<input type="text" autofocus bind:value={new_name} on:blur={done} on:keyup={done} />
{/if}

<style>
	button {
		position: relative;
		padding: 0 0 0 0.2em;
		font-size: var(--font-size);
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

	.file-row {
		position: relative;
		height: 1.4em;
		z-index: 1;
	}

	.file-actions {
		position: absolute;
		display: flex;
		right: -2rem;
		top: 0;
		height: 100%;
		display: none;
		background-color: var(--back-light);
		padding-right: 2rem;
		white-space: pre;
	}

	.file-row:hover .file-actions {
		display: block;
	}

	.file-row::before {
		content: '';
		display: none;
		position: absolute;
		right: calc(-2rem + 1px);
		left: -20rem;
		height: 1.4em;
		background: var(--back-light);
		z-index: -1;
	}

	.file-row:hover::before {
		display: block;
	}

	.icon {
		margin-top: 0.2rem;
		height: 100%;
		width: 1.5rem;
		padding: 0;
		background-size: 1.2rem 1.2rem;
		background-repeat: no-repeat;
	}

	.rename {
		background-image: url(./rename.svg);
	}

	.delete {
		background-image: url(./delete.svg);
	}
</style>
