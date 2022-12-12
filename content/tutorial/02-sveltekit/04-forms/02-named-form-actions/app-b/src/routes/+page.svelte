<script>
	export let data;
</script>

<h1>todos</h1>

<form method="POST" action="?/create">
	<label>
		add a todo:
		<input name="description" />
	</label>
</form>

<ul>
	{#each data.todos as todo (todo.id)}
		<li class="todo">
			<form method="POST" action="?/delete">
				<input type="hidden" name="id" value={todo.id} />
				<button aria-label="Mark as complete">✔</button>

				{todo.description}
			</form>
		</li>
	{/each}
</ul>
