<script>
	import { page, navigating, updated } from '$app/stores';
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

{#if $updated}
	<div class="toast">
		<p>
			A new version of the app is available

			<button on:click={() => location.reload()}>
				reload the page
			</button>
		</p>
	</div>
{/if}

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

