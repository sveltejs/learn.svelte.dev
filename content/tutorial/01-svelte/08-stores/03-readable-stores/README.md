---
title: Stores de lecture
---

Tous les
<span class="vo">[stores](SVELTE_SITE_URL/docs/sveltejs#store)</span> ne devraient pas être modifiables par n'importe quel module qui en possède la référence. Par exemple, vous pourriez avoir un store qui représente la position du curseur ou la géolocalisation de l'utilisateur, et cela n'aurait pas de sens de pouvoir changer ces valeurs de l'"extérieur". Pour ces cas-là, nous pouvons utiliser des stores _de lecture_.

Cliquez sur l'onglet `stores.js`. Le premier argument d'un `readable` est une valeur initiale, qui peut être `null` ou `undefined` si vous n'en avez pas encore. Le deuxième argument est une fonction `start` qui prend un
<span class="vo">[callback](SVELTE_SITE_URL/docs/development#callback)</span> `set` et renvoie une fonction `stop`. La fonction `start` est exécutée quand le
<span class="vo">[store](SVELTE_SITE_URL/docs/sveltejs#store)</span> a son premier abonné ; `stop` est appelée lorsque le store perd son dernier abonné.

```js
/// file: stores.js
export const time = readable(+++new Date()+++, function start(set) {
+++	const interval = setInterval(() => {
		set(new Date());
	}, 1000);+++

	return function stop() {
		+++clearInterval(interval);+++
	};
});
```
