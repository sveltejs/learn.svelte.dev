<script>
	import Card from './Card.svelte';
</script>

<main>
	<Card>
		<span>Patrick BATEMAN</span>
		<span>Vice President</span>

		<span slot="telephone">212 555 6342</span>

		<span slot="company">
			Pierce &amp; Pierce
			<small>Mergers and Aquisitions</small>
		</span>
		
		<span slot="address">358 Exchange Place, New York, N.Y. 100099 fax 212 555 6390 telex 10 4534</span>
	</Card>

	<Card />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2em;
		grid-template-rows: 1fr 1fr;
		place-items: center;
		height: 100%;
		background: url(./wood.svg);
	}

	small {
		display: block;
		font-size: 0.6em;
		text-align: right;
	}

	@media (min-aspect-ratio: 3.5 / 2.0) {
		main {
			flex-direction: row;
		}
	}
</style>