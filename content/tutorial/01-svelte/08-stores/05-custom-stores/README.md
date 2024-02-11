---
title: Stores personnalisés
---

Tout objet qui implémente correctement la méthode `subscribe` est un <span class="vo">[store](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#store)</span>. Au-delà de ça, vous avez le champ libre. Il est notamment très simple de créer des stores personnalisés avec de la logique métier.

Par exemple, le <span class="vo">[store](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#store)</span> `count` de notre premier exemple pourrait avoir les méthodes `increment`, `decrement` et `reset`, et ne pas du tout exposer `set` et `update` :

```js
/// file: stores.js
function createCount() {
	const { subscribe, set, update } = writable(0);

	return {
		subscribe,
		increment: () => +++update((n) => n + 1)+++,
		decrement: () => +++update((n) => n - 1)+++,
		reset: () => +++set(0)+++
	};
}
```
