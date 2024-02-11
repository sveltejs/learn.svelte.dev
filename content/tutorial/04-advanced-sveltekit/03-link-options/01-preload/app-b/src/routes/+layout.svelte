<script>
	import { navigating } from '$app/stores';

	let previous;
	let start;
	let end;

	$: if ($navigating) {
		start = Date.now();
		end = null;
		previous = $navigating;
	} else {
		end = Date.now();
	}
</script>

<nav>
	<a href="/">accueil</a>
	<a href="/slow-a" data-sveltekit-preload-data>slow-a</a>
	<a href="/slow-b">slow-b</a>
</nav>

<slot />

{#if previous && end}
<p>a navigué depuis {previous.from.url.pathname} vers {previous.to.url.pathname} en <strong>{end - start} ms</strong></p>
{/if}
