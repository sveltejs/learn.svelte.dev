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

<p>...en attente</p>
