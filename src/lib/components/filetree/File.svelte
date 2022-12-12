<script>
	import { open } from './ContextMenu.svelte';
	import * as context from './context.js';

	/** @type {import('$lib/types').FileStub} */
	export let file;
	export let read_only = false;

	const { selected, endstate, select, edit, remove } = context.get();

	let editing = false;
	let new_name = '';

	$: can_remove = !read_only && !$endstate[file.name];

	/** @param {MouseEvent} e */
	function open_menu(e) {
		if (!can_remove) return;

		/** @type {import('./ContextMenu.svelte').MenuItems} */
		const actions = [
			{
				name: 'Rename',
				action: () => {
					new_name = file.basename;
					editing = true;
				}
			},
			{
				name: 'Delete',
				action: () => {
					remove(file);
				}
			}
		];

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
	<div class="row">
		<button
			class="basename"
			class:selected={file === $selected}
			on:click={() => select(file)}
			on:contextmenu|preventDefault={open_menu}
		>
			{file.basename}
		</button>
		<div class="actions">
			{#if can_remove}
				<button
					aria-label="Rename"
					class="icon rename"
					on:click={() => {
						new_name = file.basename;
						editing = true;
					}}
				/>
				<button aria-label="Delete" class="icon delete" on:click={() => remove(file)} />
			{/if}
		</div>
	</div>
{:else}
	<!-- svelte-ignore a11y-autofocus -->
	<input
		class="basename"
		type="text"
		autofocus
		autocomplete="off"
		spellcheck="false"
		bind:value={new_name}
		on:blur={done}
		on:keyup={done}
	/>
{/if}

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

	.icon {
		/* margin-top: 0.2rem; */
		height: 100%;
		width: 1.5rem;
	}

	.rename {
		background-image: url(../../icons/rename.svg);
	}

	.delete {
		background-image: url(../../icons/delete.svg);
	}
</style>
