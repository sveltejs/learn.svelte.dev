<script>
	import { page } from '$app/stores';

	let online =
		typeof navigator !== 'undefined' ? navigator.onLine : true;
</script>

{#if $page.status === 404}
	<h1>Page non trouvée</h1>
{:else if !online}
	<h1>Vous être hors ligne</h1>
{:else}
	<h1>Oups !</h1>
	<p>{$page.error.message}</p>
{/if}
