<script>
	export let data;
	export let form;
</script>

<h1>Todos</h1>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<form method="POST" action="?/create">
	<label>
		Add a todo
		<input
			name="description"
			value={form?.description ?? ''}
			required
		/>
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
