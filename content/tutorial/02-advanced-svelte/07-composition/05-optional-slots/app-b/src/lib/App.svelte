<script>
	import FilterableList from './FilterableList.svelte';
	import { colors } from './colors.js';
</script>

<FilterableList
	data={colors}
	field="name"
	let:item={row}
>
	<div class="row">
		<span class="color" style="background-color: {row.hex}" />
		<span class="name">{row.name}</span>
		<span class="hex">{row.hex}</span>
		<span class="rgb">{row.rgb}</span>
		<span class="hsl">{row.hsl}</span>
	</div>
</FilterableList>

<style>
	.row {
		display: grid;
		align-items: center;
		grid-template-columns: 2em 4fr 3fr;
		gap: 1em;
		padding: 0.1em;
		background: var(--bg-1);
		border-radius: 0.2em;
	}

	header {
		font-weight: bold;
	}

	.row:not(header):hover {
		background: var(--bg-2);
	}

	.row:hover {
		background: var(--bg-2);
	}

	.color {
		aspect-ratio: 1;
		height: 100%;
		border-radius: 0.1em;
	}

	.rgb, .hsl {
		display: none;
	}

	@media (min-width: 40rem) {
		.row {
			grid-template-columns: 2em 4fr 3fr 3fr;
		}

		.rgb {
			display: block;
		}
	}

	@media (min-width: 60rem) {
		.row {
			grid-template-columns: 2em 4fr 3fr 3fr 3fr;
		}

		.hsl {
			display: block;
		}
	}
</style>