<script>
	export let data;
</script>

<div class="centered">
	<h1>à faire</h1>

	<label>
		ajouter une tâche :
		<input
			type="text"
			autocomplete="off"
			on:keydown={async (e) => {
				if (e.key === 'Enter') {
					const input = e.currentTarget;
					const description = input.value;

					// TODO gérer la soumission

					input.value = '';
				}
			}}
		/>
	</label>

	<ul class="todos">
		{#each data.todos as todo (todo.id)}
			<li>
				<label>
					<input
						type="checkbox"
						checked={todo.done}
						on:change={async (e) => {
							const done = e.currentTarget.checked;

							// TODO gérer la modification
						}}
					/>
					<span>{todo.description}</span>
					<button
						aria-label="Marquer comme terminée"
						on:click={async (e) => {
							// TODO gérer la suppression
						}}
					/>
				</label>
			</li>
		{/each}
	</ul>
</div>

<style>
	.centered {
		max-width: 20em;
		margin: 0 auto;
	}

	label {
		display: flex;
		width: 100%;
	}

	input[type="text"] {
		flex: 1;
	}

	span {
		flex: 1;
	}

	button {
		border: none;
		background: url(./remove.svg) no-repeat 50% 50%;
		background-size: 1rem 1rem;
		cursor: pointer;
		height: 100%;
		aspect-ratio: 1;
		opacity: 0.5;
		transition: opacity 0.2s;
	}

	button:hover {
		opacity: 1;
	}
</style>
