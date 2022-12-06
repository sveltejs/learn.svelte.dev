<script>
	export let data;
</script>

<h1>Todos</h1>

<form method="POST" action="?/create">
	<label>
		Add a todo
		<input name="description" />
	</label>
</form>

<ul>
	{#each data.todos as todo (todo.id)}
		<li class="todo">
			{todo.description}

			<form method="POST" action="?/delete">
				<input type="hidden" name="id" value={todo.id} />
				<button>Done!</button>
			</form>
		</li>
	{/each}
</ul>
