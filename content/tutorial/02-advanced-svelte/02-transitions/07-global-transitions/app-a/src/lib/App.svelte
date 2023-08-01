<script>
	import { slide } from 'svelte/transition';

	let showItems = true;
	let i = 5;
	let items = ['un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'];
</script>

<label>
	<input type="checkbox" bind:checked={showItems} />
	afficher la liste
</label>

<label>
	<input type="range" bind:value={i} max="10" />
</label>

{#if showItems}
	{#each items.slice(0, i) as item}
		<div transition:slide>
			{item}
		</div>
	{/each}
{/if}

<style>
	div {
		padding: 0.5em 0;
		border-top: 1px solid #eee;
	}
</style>
