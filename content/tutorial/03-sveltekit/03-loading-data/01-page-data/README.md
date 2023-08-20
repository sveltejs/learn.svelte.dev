---
title: Données de page
path: /blog
---

Au fond, le boulot de SvelteKit se résume à trois choses :

1. **<span class="vo">[Routing](SVELTE_SITE_URL/docs/web#routing)</span>** — déterminer quelle route correspond à une requête entrante
2. **Chargement** — récupérer la donnée nécessaire à la route
3. **Rendu** - générer du HTML (sur le serveur) ou mettre à jour le <span class="vo">[DOM](SVELTE_SITE_URL/docs/web#dom)</span> (dans le navigateur)

Nous avons déjà vu comment le routing et le rendu fonctionnent. Parlons maintenant de la partie du milieu — le chargement de données.

Chaque page de votre application peut déclarer une fonction `load` dans un fichier `+page.server.js` à côté du fichier `+page.svelte`. Comme le nom du fichier le suggère, ce module s'exécutera uniquement sur le serveur, même pour les navigations effectuées côté client. Ajoutons un fichier `src/routes/blog/+page.server.js` afin de remplacer les liens écrits en dur dans `src/routes/blog/+page.svelte` avec de la vraie donnée de billets de blog :

```js
/// file: src/routes/blog/+page.server.js
import { posts } from './data.js';

export function load() {
	return {
		summaries: posts.map((post) => ({
			slug: post.slug,
			title: post.title
		}))
	};
}
```

> Dans le cadre de ce tutoriel, nous importons la donnée depuis `src/routes/blog/data.js`. Dans une vraie application, vous chargeriez plutôt cette donnée depuis une base de données ou un CMS, mais pour le moment nous le faisons de cette manière.

Nous pouvons accéder à cette donnée dans `src/routes/blog/+page.svelte` via la <span class="vo">[prop](SVELTE_SITE_URL/docs/sveltejs#props)</span> `data` :

```svelte
/// file: src/routes/blog/+page.svelte
+++<script>
	export let data;
</script>+++

<h1>blog</h1>

<ul>
---	<li><a href="/blog/one">one</a></li>
	<li><a href="/blog/two">two</a></li>
	<li><a href="/blog/three">three</a></li>---
+++	{#each data.summaries as { slug, title }}
		<li><a href="/blog/{slug}">{title}</a></li>
	{/each}+++
</ul>
```

Faisons maintenant la même chose pour la page de billet :

```js
/// file: src/routes/blog/[slug]/+page.server.js
import { posts } from '../data.js';

export function load({ params }) {
	const post = posts.find((post) => post.slug === params.slug);

	return {
		post
	};
}
```

```svelte
/// file: src/routes/blog/[slug]/+page.svelte
+++<script>
	export let data;
</script>+++

---<h1>blog post</h1>---
+++<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>+++
```

Il reste un dernier petit détail qu'il nous faut régler — l'utilisateur ou l'utilisatrice pourrait vouloir visiter un chemin invalide comme `/blog/nan`, auquel cas nous voulons lui répondre avec une page 404 :

```js
/// file: src/routes/blog/[slug]/+page.server.js
+++import { error } from '@sveltejs/kit';+++
import { posts } from '../data.js';

export function load({ params }) {
	const post = posts.find((post) => post.slug === params.slug);

	+++if (!post) throw error(404);+++

	return {
		post
	};
}
```

Nous en apprendrons plus sur la gestion des erreurs dans des chapitres ultérieurs.
