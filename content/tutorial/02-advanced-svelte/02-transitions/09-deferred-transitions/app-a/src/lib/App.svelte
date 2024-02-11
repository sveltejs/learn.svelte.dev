<script>
	import { createTodoStore } from './todos.js';
	import TodoList from './TodoList.svelte';

	const todos = createTodoStore([
		{ done: false, description: 'écrire de la doc' },
		{ done: false, description: 'commencer un article de blog' },
		{ done: true,  description: 'acheter du lait' },
		{ done: false, description: 'tondre la pelouse' },
		{ done: false, description: 'nourrir la tortue' },
		{ done: false, description: 'résoudre des bugs' },
	]);
</script>

<div class="board">
	<input
		placeholder="Qu'est ce qui doit être fait ?"
		on:keydown={(e) => {
			if (e.key !== 'Enter') return;

			todos.add(e.currentTarget.value);
			e.currentTarget.value = '';
		}}
	/>

	<div class="todo">
		<h2>A faire</h2>
		<TodoList store={todos} done={false} />
	</div>

	<div class="done">
		<h2>Fait</h2>
		<TodoList store={todos} done={true} />
	</div>
</div>

<style>
	.board {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-column-gap: 1em;
		max-width: 36em;
		margin: 0 auto;
	}

	.board > input {
		font-size: 1.4em;
		grid-column: 1/3;
		padding: 0.5em;
		margin: 0 0 1rem 0;
	}

	h2 {
		font-size: 2em;
		font-weight: 200;
	}
</style>
