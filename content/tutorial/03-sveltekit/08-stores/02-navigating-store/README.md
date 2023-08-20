---
title: navigating
---

Le <span class="vo">[store](SVELTE_SITE_URL/docs/sveltejs#store)</span> `navigating` représente la navigation courante. Lorsqu'une navigation commence — suite au clic sur un lien, une navigation vers l'arrière ou l'avant, ou un `goto` programmatique — la valeur de `navigation` devient un objet avec les propriétés suivantes :

- `from` et `to` — des objets avec les propriétés `params`, `route` et `url`
- `type` — le type de navigation, par ex. `link`, `popstate` ou `goto`

> Vous trouverez plus d'informations sur le type de navigation en vous rendant sur la documentation de [`Navigation`](KIT_SITE_URL/docs/types#public-types-navigation).

On peut s'en servir pour afficher un indicateur de chargement pour les navigations qui prennent du temps. Dans cet exercice, les pages `src/routes/+page.server.js` et `src/routes/about/+page.server.js` ont toutes les deux une latence articifielle. Dans `src/routes/+layout.svelte`, importez le <span class="vo">[store](SVELTE_SITE_URL/docs/sveltejs#store)</span> `navigating` et ajouter un message à la barre de navigation :

```svelte
/// file: src/routes/+layout.svelte
<script>
	import { page, +++navigating+++ } from '$app/stores';
</script>

<nav>
	<a href="/" aria-current={$page.url.pathname === '/'}>
		accueil
	</a>

	<a href="/about" aria-current={$page.url.pathname === '/about'}>
		à propos
	</a>

+++	{#if $navigating}
		en cours de navigation vers {$navigating.to.url.pathname}
	{/if}+++
</nav>

<slot />
```
