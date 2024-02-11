---
title: beforeUpdate et afterUpdate
---

La fonction `beforeUpdate` permet de prévoir une fonction à exécuter juste avant la mise à jour du <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span>. `afterUpdate` est son alter-ego, utile pour exécuter du code une fois que le DOM est synchronisé avec votre donnée.

Ensemble, elles permettent d'effectuer des actions de manière impérative, notamment des actions qu'il serait difficile de réaliser avec des méthodes se basant uniquement sur l'état, comme mettre à jour la position de défilement d'un élément.

Ce robot conversationnel [Eliza](https://fr.wikipedia.org/wiki/ELIZA) (qui ne parle qu'anglais), est pénible à utiliser, parce que vous devez en permanence faire défiler la fenêtre. Corrigeons cela.

```js
/// file: App.svelte
let div;
+++let autoscroll = false;+++

beforeUpdate(() => {
+++	if (div) {
		const scrollableDistance = div.scrollHeight - div.offsetHeight;
		autoscroll = div.scrollTop > scrollableDistance - 20;
	}+++
});

afterUpdate(() => {
+++	if (autoscroll) {
		div.scrollTo(0, div.scrollHeight);
	}+++
});
```

Notez que `beforeUpdate` sera exécuté la première fois avant le montage du composant, nous devons donc d'abord vérifier l'existence de `div` avant d'en lire les propriétés.
