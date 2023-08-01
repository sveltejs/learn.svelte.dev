<script>
	let online =
		typeof navigator !== 'undefined' ? navigator.onLine : true;
</script>

{#if !online}
	<h1>Vous êtes hors ligne</h1>
{:else}
	<h1>Oups !</h1>
	<p>Quelque chose s'est mal passé</p>
{/if}
