<script>
	import Todo from './Todo.svelte';

	let todos = [
		{ id: 1, done: true, text: 'laver la voiture' },
		{ id: 2, done: false, text: 'sortir le chien' },
		{ id: 3, done: false, text: 'tondre la pelouse' }
	];

	function toggle(toggled) {
		todos = todos.map((todo) => {
			if (todo === toggled) {
				// on renvoie un nouvel objet
				return {
					id: todo.id,
					text: todo.text,
					done: !todo.done
				};
			}

			// on renvoie le même objet
			return todo;
		});
	}
</script>

<div class="centered">
	<h1>à faire</h1>

	<ul class="todos">
		{#each todos as todo (todo.id)}
			<Todo {todo} on:change={() => toggle(todo)} />
		{/each}
	</ul>
</div>

<style>
	.centered {
		max-width: 20em;
		margin: 0 auto;
	}
</style>
