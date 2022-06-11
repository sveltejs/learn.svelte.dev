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

		<button on:click={() => store.remove(todo)}>
			<svg viewBox="0 0 24 24">
				<path fill="currentColor" stroke="none" d="M22 4.2h-5.6L15 1.6c-.1-.2-.4-.4-.7-.4H9.6c-.2 0-.5.2-.6.4L7.6 4.2H2c-.4 0-.8.4-.8.8s.4.8.8.8h1.8V22c0 .4.3.8.8.8h15c.4 0 .8-.3.8-.8V5.8H22c.4 0 .8-.3.8-.8s-.4-.8-.8-.8zM10.8 16.5c0 .4-.3.8-.8.8s-.8-.3-.8-.8V10c0-.4.3-.8.8-.8s.8.3.8.8v6.5zm4 0c0 .4-.3.8-.8.8s-.8-.3-.8-.8V10c0-.4.3-.8.8-.8s.8.3.8.8v6.5z" />
			</svg>
		</button>
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
		border: none;
		background: none;
		opacity: 0;
		transition: opacity 0.2s;
		cursor: pointer;
	}

	label:hover {
		background: #fafafa;
	}

	label:hover button {
		opacity: 0.7;
	}
</style>