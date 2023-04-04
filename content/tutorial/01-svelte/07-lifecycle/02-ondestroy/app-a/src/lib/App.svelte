<script>
	import Timer from './Timer.svelte';

	let open = false;
	const toggle = () => (open = !open);

	let count = 0;
	const increment = () => (count += 1);
</script>

<button on:click={toggle}>{open ? 'Close' : 'Open'} Timer</button>

<p>Count: {count}</p>

{#if open}
	<Timer callback={increment} />
{/if}
