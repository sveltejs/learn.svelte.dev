<script>
	import { page, navigating } from '$app/stores';
</script>

<nav>
	<a href="/" aria-current={$page.url.pathname === '/'}>
		accueil
	</a>

	<a href="/about" aria-current={$page.url.pathname === '/about'}>
		à propos
	</a>

	{#if $navigating}
		en cours de navigation vers {$navigating.to.url.pathname}
	{/if}
</nav>

<slot />
