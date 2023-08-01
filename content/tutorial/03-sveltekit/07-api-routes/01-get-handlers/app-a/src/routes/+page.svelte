<script>
	/** @type {number} */
	let number;

	async function roll() {
		const response = await fetch('/roll');
		number = await response.json();
	}
</script>

<button on:click={roll}>Lancer les dés</button>

{#if number !== undefined}
	<p>Vous avez obtenu un {number}</p>
{/if}
