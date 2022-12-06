<script>
	export let data;
</script>

<h1>Todos</h1>

<form method="POST">
	<label>
		Add a todo
		<input name="description" />
	</label>
</form>

<ul>
	{#each data.todos as todo (todo.id)}
		<li class="todo">
			{todo.description}
		</li>
	{/each}
</ul>
