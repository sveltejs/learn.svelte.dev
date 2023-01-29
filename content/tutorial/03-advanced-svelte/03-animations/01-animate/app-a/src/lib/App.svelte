<script>
	import { createTodoStore } from './todos.js';
	import TodoList from './TodoList.svelte';

	const todos = createTodoStore([
		{ done: false, description: 'write some docs' },
		{ done: false, description: 'start writing blog post' },
		{ done: true, description: 'buy some milk' },
		{ done: false, description: 'mow the lawn' },
		{ done: false, description: 'feed the turtle' },
		{ done: false, description: 'fix some bugs' }
	]);
</script>

<div class="board">
	<input
		placeholder="what needs to be done?"
		on:keydown={(e) => {
			if (e.key === 'Enter') {
				todos.add(e.currentTarget.value);
				e.currentTarget.value = '';
			}
		}}
	/>

	<div class="todo">
		<h2>todo</h2>
		<TodoList store={todos} filter={(t) => !t.done} />
	</div>

	<div class="done">
		<h2>done</h2>
		<TodoList store={todos} filter={(t) => t.done} />
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
		border-radius: 5px;
		background: #f4f4f4;
		padding: 0.5em;
		border: none;
		color: black;
	}

	h2 {
		font-size: 2em;
		font-weight: 200;
	}

	.todo {
		--label: #222;
		--filter: drop-shadow(2px 3px 6px rgba(0,0,0,0.1));
	}

	.done {
		--label: #999;
		--filter: none;
	}
</style>
