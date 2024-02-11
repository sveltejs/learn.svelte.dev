<script>
	import { browser } from '$app/environment';

	let count = 0;

	function increment() {
		count += 1;
	}
</script>

<h1>Généré {browser ? 'par le navigateur' : 'sur le serveur'}</h1>

<button on:click={increment}>
	Clics: {count}
</button>
