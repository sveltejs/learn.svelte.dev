<script>
	import { onMount } from 'svelte';

	let seconds = 0;

	onMount(() => {
		const interval = setInterval(() => {
			seconds += 1;
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<nav>
	<a href="/">accueil</a>
	<a href="/about">à propos</a>
</nav>

<slot />

<p>la page est ouverte depuis {seconds} secondes</p>
