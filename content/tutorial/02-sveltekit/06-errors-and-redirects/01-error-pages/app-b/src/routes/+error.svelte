<script>
	import { page } from '$app/stores';

	let online =
		typeof navigator !== 'undefined' ? navigator.onLine : true;
</script>

{#if $page.status === 404}
	<h1>not found</h1>
{:else if !online}
	<h1>you're offline</h1>
{:else}
	<h1>oops!</h1>
	<p>{$page.error.message}</p>
{/if}
