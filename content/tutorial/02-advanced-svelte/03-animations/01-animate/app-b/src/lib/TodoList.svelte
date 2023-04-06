<script>
	import { flip } from 'svelte/animate';
	import { send, receive } from './transition.js';

	export let store;
	export let done;
</script>

<ul class="todos">
	{#each $store.filter((todo) => todo.done === done) as todo (todo.id)}
		<li
			class:done
			in:receive={{ key: todo.id }}
			out:send={{ key: todo.id }}
			animate:flip={{ duration: 200 }}
		>
			<label>
				<input
					type="checkbox"
					checked={todo.done}
					on:change={(e) => store.mark(todo, e.currentTarget.checked)}
				/>

				<span>{todo.description}</span>

				<button on:click={() => store.remove(todo)} aria-label="Remove" />
			</label>
		</li>
	{/each}
</ul>

<style>
	label {
		width: 100%;
		height: 100%;
		display: flex;
	}

	.done {
		opacity: 0.5;
	}

	span {
		flex: 1;
	}

	button {
		background-image: url(./remove.svg);
	}
</style>