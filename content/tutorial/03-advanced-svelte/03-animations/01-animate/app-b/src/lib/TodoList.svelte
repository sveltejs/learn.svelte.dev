<script>
	import { flip } from 'svelte/animate';
	import { send, receive } from './transition.js';

	export let store;
	export let filter;
</script>

{#each $store.filter(filter) as todo (todo.id)}
	<label
		in:receive={{ key: todo.id }}
		out:send={{ key: todo.id }}
		animate:flip={{ duration: 200 }}
	>
		<input
			type="checkbox"
			checked={todo.done}
			on:change={(e) => store.mark(todo, e.currentTarget.checked)}
		/>

		<span>{todo.description}</span>

		<button on:click={() => store.remove(todo)} aria-label="Remove" />
	</label>
{/each}

<style>
	label {
		position: relative;
		display: flex;
		align-items: center;
		padding: 0.6em;
		margin: 0 0 0.5em 0;
		gap: 0.5em;
		border-radius: 5px;
		user-select: none;
		background: white;
		color: var(--label);
		filter: var(--filter);
	}

	span {
		flex: 1;
	}

	button {
		width: 2em;
		height: 2em;
		border: none;
		background: url(./remove.svg) no-repeat 50% 50%;
		background-size: 75%;
		opacity: 0;
		transition: opacity 0.2s;
		cursor: pointer;
	}

	label:hover {
		background: #fafafa;
	}

	label:hover button {
		opacity: 0.2;
	}

	label:hover button:hover {
		opacity: 0.5;
	}
</style>