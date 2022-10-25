<script>
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		const interval = setInterval(() =>
			invalidate('/api/clock')
		);
		return () => clearInterval(interval);
	});
</script>

<div>{data.time}</div>
