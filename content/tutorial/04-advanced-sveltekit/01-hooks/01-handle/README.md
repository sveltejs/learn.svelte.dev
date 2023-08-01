---
title: handle
---

SvelteKit fournit plusieurs <span class="vo">[_hooks_](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#hook)</span> — moyens d'intercepter et de remplacer le comportement par défaut du <span class="vo">[framework](PUBLIC_SVELTE_SITE_URL/docs/web#framework)</span>.

Le <span class="vo">[hook](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#hook)</span> le plus simple est `handle`, qui appartient à `src/hooks.server.js`. Il reçoit un objet `event` ainsi qu'une fonction `resolve`, et renvoie un objet [Response](https://developer.mozilla.org/fr/docs/Web/API/Response).

`resolve` est l'endroit où la magie se produit : SvelteKit fait correspondre l'URL de la requête entrante avec une route de votre application, importe le code correspondant (depuis les fichiers `+page.server.js`, `+page.svelte`, et les autres), charge la donnée requise par la route, et génère la réponse.

Le <span class="vo">[hook](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#hook)</span> `handle` par défaut ressemble à ça :

```js
/// file: src/hooks.server.js
export async function handle({ event, resolve }) {
	return await resolve(event);
}
```

Pour les pages (et non les [routes d'API](get-handlers)), vous pouvez modifier le HTML généré avec `transformPageChunk` :

```js
/// file: src/hooks.server.js
export async function handle({ event, resolve }) {
	return await resolve(event, {
+++		transformPageChunk: ({ html }) => html.replace(
			'<body',
			'<body style="color: hotpink"'
		)+++
	});
}
```

Vous pouvez aussi entièrement créer de nouvelles routes :

```js
/// file: src/hooks.server.js
export async function handle({ event, resolve }) {
+++	if (event.url.pathname === '/ping') {
		return new Response('pong');
	}+++

	return await resolve(event, {
		transformPageChunk: ({ html }) => html.replace(
			'<body',
			'<body style="color: hotpink"'
		)
	});
}
```
