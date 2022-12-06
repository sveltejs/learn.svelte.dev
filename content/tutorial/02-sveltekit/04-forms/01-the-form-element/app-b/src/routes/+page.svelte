<script>
	export let data;
</script>

<h1>Todos</h1>

<form method="POST">
	<input
		name="description"
		placeholder="What needs to be done?"
	/>
</form>

{#each data.todos as todo (todo.id)}
	<div class="todo">
		<input
			name="description"
			value={todo.description}
		/>

		<button>
			{todo.done ? 'mark todo' : 'mark done'}
		</button>
	</div>
{/each}
