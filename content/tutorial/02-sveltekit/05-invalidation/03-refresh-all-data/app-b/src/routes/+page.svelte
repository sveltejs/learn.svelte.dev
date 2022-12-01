<script>
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		const interval = setInterval(
			() => invalidateAll(),
			1000
		);
		return () => clearInterval(interval);
	});
</script>

<div>{data.time}</div>
