<script>
	import { browser } from '$app/environment';

	let count = 0;

	function increment() {
		count += 1;
	}
</script>

<h1>Rendered {browser ? 'in the browser' : 'on the server'}</h1>

<button on:click={increment}>
	Clicks: {count}
</button>
