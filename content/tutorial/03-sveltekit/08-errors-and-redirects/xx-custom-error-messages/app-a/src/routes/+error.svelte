<script>
	let online =
		typeof navigator !== 'undefined' ? navigator.onLine : true;
</script>

{#if !online}
	<h1>you're offline</h1>
{:else}
	<h1>oops!</h1>
	<p>Something went wrong</p>
{/if}
