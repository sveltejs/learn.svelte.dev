---
title: updated
---

Le <span class="vo">[store](SVELTE_SITE_URL/docs/sveltejs#store)</span> `updated` contient `true` ou `false` selon si une nouvelle version de l'application a été déployée depuis que la page a été affiché la première fois. Pour que ceci fonctionne, votre `svelte.config.js` doit spécifier `kit.version.pollInterval`.

Les changements de version se produisent uniquement en production, pas en développement. Pour cette raison, `$updated` sera toujours `false` dans le cadre de ce tutoriel.

Vous pouvez vérifier manuellement si une nouvelle version est disponible, sans utiliser `pollInterval`, en appelant `updated.check()`.

```svelte
/// file: src/routes/+layout.svelte
<script>
	import { page, navigating, +++updated+++ } from '$app/stores';
</script>

<nav>
	<a href="/" aria-current={$page.url.pathname === '/'}>
		accueil
	</a>

	<a href="/about" aria-current={$page.url.pathname === '/about'}>
		à propose
	</a>

	{#if $navigating}
		en cours de navigation vers {$navigating.to.url.pathname}
	{/if}
</nav>

<slot />

+++{#if $updated}
	<p class="toast">
		Une nouvelle version de l'application est disponible

		<button on:click={() => location.reload()}>
			recharger la page
		</button>
	</p>
{/if}+++
