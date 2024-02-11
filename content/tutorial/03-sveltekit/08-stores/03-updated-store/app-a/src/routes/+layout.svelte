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

<div class="toast">
	<p>
		Une nouvelle version de l'application est disponible

		<button on:click={() => location.reload()}>
			rechargez la page
		</button>
	</p>
</div>

<style>
	.toast {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		padding: 1rem;
		display: flex;
		justify-content: center;
		gap: 1rem;
	}

	.toast p {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: var(--bg-2);
		padding: 0.5rem 0.5rem 0.5rem 1rem;
		border-radius: 4px;
	}
</style>

