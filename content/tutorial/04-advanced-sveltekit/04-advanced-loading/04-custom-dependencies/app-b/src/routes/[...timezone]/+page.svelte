<script>
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';

	export let data;

	onMount(() => {
		const interval = setInterval(() => {
			invalidate('data:now');
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<h1>
	{new Intl.DateTimeFormat([], {
		timeStyle: 'full',
		timeZone: data.timezone
	}).format(new Date(data.now))}
</h1>
