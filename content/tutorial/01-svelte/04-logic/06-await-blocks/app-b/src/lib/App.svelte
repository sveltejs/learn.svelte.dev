<script>
	import { getRandomNumber } from './utils.js';

	let promise = getRandomNumber();

	function handleClick() {
		promise = getRandomNumber();
	}
</script>

<button on:click={handleClick}>
	générer un nombre aléatoire
</button>

{#await promise}
	<p>...en attente</p>
{:then number}
	<p>Le nombre est {number}</p>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
