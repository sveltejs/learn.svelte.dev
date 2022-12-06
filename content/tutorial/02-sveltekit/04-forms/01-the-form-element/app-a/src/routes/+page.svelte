<script>
	export let data;
</script>

<h1>Todos</h1>

{#each data.todos as todo}
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
