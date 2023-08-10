---
title: Slots nommés
---

L'exemple précédent contenait un <span class="vo">[slot](SVELTE_SITE_URL/docs/sveltejs#slot)</span> par défaut, qui affiche l'enfant direct d'une instance de composant. Parfois vous aurez besoin de plus de contrôle sur le positionnement. Dans ces cas-là, nous pouvons utiliser des _slots nommés_.

Dans le composant `<Card>`, nous avons un `<span slot="telephone">` ainsi que d'autres pour `company` et `address`. Ajoutons les <span class="vo">[slots](SVELTE_SITE_URL/docs/sveltejs#slot)</span> nommés correspondants dans `Card.svelte` :

```svelte
/// file: Card.svelte
<div class="card">
+++	<header>
		<slot name="telephone" />
		<slot name="company" />
	</header>+++

	<slot />

+++	<footer>
		<slot name="address" />
	</footer>+++
</div>
```

Nous avons besoin d'ajouter un peu de style à l'élément `<small>` dans `App.svelte` afin qu'il occupe sa propre ligne. Le contenu de `<Card>` hérite des styles de `Card.svelte`, comme `font-family` (le lettrage s'appelle apparemment ['Silian Rail'](https://www.youtube.com/watch?v=aZVkW9p-cCU)),  mais les règles normales de <span class="vo">[scope](SVELTE_SITE_URL/docs/development#scope)</span> s'appliquent — nous avons besoin d'ajouter les styles dans `App.svelte` car c'est là que l'élément est défini :

```svelte
/// file: App.svelte
<style>
	main {
		display: grid;
		place-items: center;
		height: 100%;
		background: url(./wood.svg);
	}

+++	small {
		display: block;
		font-size: 0.6em;
		text-align: right;
	}+++
</style>
```

Une alternative serait d'ajouter le modificateur `:global` dans `Card.svelte` pour cibler tous les éléments `small` dans `.card` :

```svelte
/// file: Card.svelte
<style>
	/* ... */

	+++.card :global(small) {
		display: block;
		font-size: 0.6em;
		text-align: right;
	}+++
</style>
```
