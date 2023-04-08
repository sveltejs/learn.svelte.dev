<script>
	export let size;
</script>

<div class="board" style="--size: {size}">
	<slot name="game" />
</div>

<slot name="controls" />

<style>
	.board {
		display: grid;
		grid-template-columns: repeat(var(--size), 1fr);
		grid-template-rows: repeat(var(--size), 1fr);
		height: 100%;
		max-height: 20em;
		aspect-ratio: 1;
		background: black;
		gap: 1px;
		padding: 0.5em;
		border-radius: 0.2em;
		filter: drop-shadow(0.2em 0.2em 1em rgba(0,0,0,0.3));
	}
</style>