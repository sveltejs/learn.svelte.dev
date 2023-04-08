<script>
	const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
	let selected = colors[0];
</script>

<h1 style="color: {selected}">Pick a colour</h1>

<div>
	<button
		aria-current={selected === 'red'}
		aria-label="red"
		style="background: red"
		on:click={() => selected = 'red'}
	></button>

	<button
		aria-current={selected === 'orange'}
		aria-label="orange"
		style="background: orange"
		on:click={() => selected = 'orange'}
	></button>

	<button
		aria-current={selected === 'yellow'}
		aria-label="yellow"
		style="background: yellow"
		on:click={() => selected = 'yellow'}
	></button>

	<!-- TODO add the rest of the colours -->
	<button></button>
	<button></button>
	<button></button>
	<button></button>
</div>

<style>
	h1 {
		transition: color 0.2s;
	}

	div {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-gap: 5px;
		max-width: 400px;
	}

	button {
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--color, #fff);
		transform: translate(-2px,-2px);
		filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.2));
		transition: all 0.1s;
	}

	button[aria-current="true"] {
		transform: none;
		filter: none;
		box-shadow: inset 3px 3px 4px rgba(0,0,0,0.2);
	}
</style>