<script>
	import { onMount } from 'svelte';

	let greeting;
	onMount(async () => {
		greeting = await fetch('/api').then((r) =>
			r.text()
		);
	});
</script>

<p>{greeting}</p>
