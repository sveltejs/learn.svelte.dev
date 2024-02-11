<script>
	let todos = [
		{ done: false, text: 'finir le tutoriel Svelte' },
		{ done: false, text: 'construire une app' },
		{ done: false, text: 'dominer le monde' }
	];

	function add() {
		todos = todos.concat({
			done: false,
			text: ''
		});
	}

	function clear() {
		todos = todos.filter((t) => !t.done);
	}

	$: remaining = todos.filter((t) => !t.done).length;
</script>

<div class="centered">
	<h1>À faire</h1>

	<ul class="todos">
		{#each todos as todo}
			<li class:done={todo.done}>
				<input
					type="checkbox"
					bind:checked={todo.done}
				/>

				<input
					type="text"
					placeholder="Qu'avez-vous besoin de faire ?"
					bind:value={todo.text}
				/>
			</li>
		{/each}
	</ul>

	<p>Encore {remaining} tâches</p>

	<button on:click={add}>
		Ajouter
	</button>

	<button on:click={clear}>
		Effacer les tâches complétées
	</button>
</div>

<style>
	.centered {
		max-width: 20em;
		margin: 0 auto;
	}

	.done {
		opacity: 0.4;
	}

	li {
		display: flex;
	}

	input[type="text"] {
		flex: 1;
		padding: 0.5em;
		margin: -0.2em 0;
		border: none;
	}
</style>
