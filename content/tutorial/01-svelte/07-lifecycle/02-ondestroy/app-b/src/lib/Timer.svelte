<script>
	import { onDestroy } from 'svelte';

	export let callback;
	const interval = setInterval(callback, 1000);

	onDestroy(() => clearInterval(interval));
</script>

<p>The Timer component opened...</p>

<style>
	p {
		border: 1px solid blue;
		padding: 5px;
	}
</style>
