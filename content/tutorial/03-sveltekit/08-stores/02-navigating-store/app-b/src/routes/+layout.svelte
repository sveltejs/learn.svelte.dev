<script>
	import { page, navigating } from '$app/stores';
</script>

<nav>
	<a href="/" aria-current={$page.url.pathname === '/'}>
		home
	</a>

	<a href="/about" aria-current={$page.url.pathname === '/about'}>
		about
	</a>

	{#if $navigating}
		navigating to {$navigating.to.url.pathname}
	{/if}
</nav>

<slot />
