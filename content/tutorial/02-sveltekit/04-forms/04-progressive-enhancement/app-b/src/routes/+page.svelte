<script>
	import { fly, slide } from 'svelte/transition';
	import { enhance } from '$app/forms';

	export let data;
	export let form;
</script>

<h1>Todos</h1>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<form method="POST" action="?/create" use:enhance>
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
		<li class="todo" in:fly={{ y: 20 }} out:slide>
			{todo.description}

			<form method="POST" action="?/delete" use:enhance>
				<input type="hidden" name="id" value={todo.id} />
				<button>Done!</button>
			</form>
		</li>
	{/each}
</ul>
