<script>
	import Card from './Card.svelte';
</script>

<main>
	<Card>
		<span>Patrick BATEMAN</span>
		<span>Vice President</span>
	</Card>
</main>

<style>
	main {
		display: grid;
		place-items: center;
		height: 100%;
		background: url(./wood.svg);
	}
</style>