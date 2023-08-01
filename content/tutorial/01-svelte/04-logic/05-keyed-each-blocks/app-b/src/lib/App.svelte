<script>
	import Thing from './Thing.svelte';

	let things = [
		{ id: 1, name: 'pomme' },
		{ id: 2, name: 'banane' },
		{ id: 3, name: 'carotte' },
		{ id: 4, name: 'donut' },
		{ id: 5, name: 'oeuf' },
	];

	function handleClick() {
		things = things.slice(1);
	}
</script>

<button on:click={handleClick}>
	Supprimer le premier élément
</button>

{#each things as thing (thing.id)}
	<Thing name={thing.name} />
{/each}
