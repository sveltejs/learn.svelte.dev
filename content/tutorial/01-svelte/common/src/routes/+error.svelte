<script>
	import { page } from '$app/stores';
</script>

{#if $page.status === 404}
	<h1>Non trouvé</h1>
	<p><a href="/">Aller à l'accueil</a></p>
{:else}
	<p>
		Le rendu côté serveur a échoué avec le code HTTP :
		<a
			target="_blank"
			href="https://httpstatusdogs.com/{$page.status}"
			>{$page.status}</a
		>
	</p>
{/if}

<style>
	h1 {
		font-weight: 200;
		font-size: 2rem;
		margin: 0 0 0.5em 0;
	}
</style>
