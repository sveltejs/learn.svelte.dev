---
title: updated
---

Le <span class="vo">[store](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#store)</span> `updated` contient `true` ou `false` selon si une nouvelle version de l'application a été déployée depuis que la page ait été affichée la première fois. Pour que ceci fonctionne, le fichier `svelte.config.js` doit spécifier `kit.version.pollInterval`.

```svelte
/// file: src/routes/+layout.svelte
<script>
	import { page, navigating, +++updated+++ } from '$app/stores';
</script>
```

Les changements de version se produisent uniquement en production, pas en développement. Pour cette raison, `$updated` sera toujours `false` dans le cadre de ce tutoriel.

Vous pouvez vérifier manuellement si une nouvelle version est disponible, sans utiliser `pollInterval`, en appelant `updated.check()`.

```svelte
/// file: src/routes/+layout.svelte

+++{#if $updated}+++
	<div class="toast">
		<p>
			Une nouvelle version de l'application est disponible

			<button on:click={() => location.reload()}>
				recharger la page
			</button>
		</p>
	</div>
+++{/if}+++
```
