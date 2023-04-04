<script>
	import { page } from '$app/stores';
</script>

{#if $page.status === 404}
	<h1>Not found</h1>
	<p><a href="/">Go to /</a></p>
{:else}
	<p>
		Server-side rendering failed with HTTP status
		code
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
