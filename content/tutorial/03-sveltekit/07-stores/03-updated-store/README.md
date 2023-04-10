---
title: updated
---

The `updated` store contains `true` or `false` depending on whether a new version of the app has been deployed since the page was first opened. For this to work, your `svelte.config.js` must specify `kit.version.pollInterval`.

Version changes only happens in production, not during development. For that reason, `$updated` will always be `false` in this tutorial.

You can manually check for new versions, regardless of `pollInterval`, by calling `updated.check()`.

```svelte
/// file: src/routes/+layout.svelte
<script>
	import { page, navigating, +++updated+++ } from '$app/stores';
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

+++{#if $updated}
	<p class="toast">
		A new version of the app is available

		<button on:click={() => location.reload()}>
			reload the page
		</button>
	</p>
{/if}+++
