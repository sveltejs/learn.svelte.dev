---
title: Fonctions GET
---

SvelteKit vous permet de créer plus que des simples pages. Nous pouvons aussi créer des _routes d'<span class="vo">[API](PUBLIC_SVELTE_SITE_URL/docs/development#api)</span>_ en ajoutant un fichier `+server.js` qui exporte des fonctions correspondant aux méthodes HTTP : `GET`, `PUT`, `POST`, `PATCH`, `DELETE`.

Cette application requête de la donnée depuis une route d'<span class="vo">[API](PUBLIC_SVELTE_SITE_URL/docs/development#api)</span> lorsque vous cliquez sur le bouton. Créez cette route en ajoutant un fichier `src/routes/roll/+server.js` :

```js
/// file: src/routes/roll/+server.js
export function GET() {
	const number = Math.floor(Math.random() * 6) + 1;

	return new Response(number, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
```

Désormais, le clic sur le bouton fonctionne correctement.

Les gestionnaires de requêtes doivent renvoyer un objet [Response](https://developer.mozilla.org/fr/docs/Web/API/Response/Response). Puisqu'il est courant de renvoyer du <span class="vo">[JSON](PUBLIC_SVELTE_SITE_URL/docs/web#json)</span> depuis une route d'<span class="vo">[API](PUBLIC_SVELTE_SITE_URL/docs/development#api)</span>, SvelteKit fournit une fonction utilitaire pour générer de telles réponses :

```js
/// file: src/routes/roll/+server.js
+++import { json } from '@sveltejs/kit';+++

export function GET() {
	const number = Math.floor(Math.random() * 6) + 1;

---	return new Response(number, {
		headers: {
			'Content-Type': 'application/json'
		}
	});---
+++	return json(number);+++
}
```
