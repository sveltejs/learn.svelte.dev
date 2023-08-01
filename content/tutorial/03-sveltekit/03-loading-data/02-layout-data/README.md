---
title: Données de layout
path: /blog
---

De la même manière que les fichiers `+layout.svelte` créent une partie de l'interface pour chaque route enfant, les fichiers `+layout.server.js` chargent de la donnée pour chaque route enfant.

Supposez que nous voulions ajouter une barre latérale "plus de billets" à notre page de billet de blog. Nous _pourrions_ renvoyer `summaries` depuis la fonction `load` de `src/routes/blog/[slug]/+page.server.js`, comme nous le faisons dans `src/routes/blog/+page.server.js`, mais cela serait répétitif.

Renommons plutôt `src/routes/blog/+page.server.js` en `src/routes/blog/+layout.server.js`. Notez que la route `/blog` continue de fonctionner — `data.summaries` est toujours disponible dans la page.

Ajoutons maintenant une barre latérale dans notre page de billet :

```svelte
/// file: src/routes/blog/[slug]/+layout.svelte
<script>
	export let data;
</script>

<div class="layout">
	<main>
		<slot />
	</main>

+++	<aside>
		<h2>Plus de billets</h2>
		<ul>
			{#each data.summaries as { slug, title }}
				<li>
					<a href="/blog/{slug}">{title}</a>
				</li>
			{/each}
		</ul>
	</aside>+++
</div>

<style>
	@media (min-width: 640px) {
		.layout {
			display: grid;
			gap: 2em;
			grid-template-columns: 1fr 16em;
		}
	}
</style>
```

Le <span class="vo">[layout](PUBLIC_SVELTE_SITE_URL/docs/web#layout)</span> (et les pages en dessous) héritent `data.summaries` du fichier parent `+layout.server.js`.

Lorsque nous naviguons d'un billet à l'autre, nous avons uniquement besoin de charger la donnée pour le billet lui-même — la donnée de <span class="vo">[layout](PUBLIC_SVELTE_SITE_URL/docs/web#layout)</span> est toujours valide. Voir la documentation sur l'[invalidation](PUBLIC_KIT_SITE_URL/docs/load#rerunning-load-functions) pour en apprendre plus.
