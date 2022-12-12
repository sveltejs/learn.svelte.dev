<script>
	export let data;
</script>

<h1>todos</h1>

<ul>
	{#each data.todos as todo (todo.id)}
		<li class="todo">
			{todo.description}
		</li>
	{/each}
</ul>
