---
title: Assignations
---

Au coeur de Svelte se trouve un système efficace de **réactivité** qui permet de garder le <span class="vo">[DOM](SITE_SVELTE/docs/web#dom)</span> en phase avec l'état de votre application — par exemple en réaction à un évènement.

Pour le mettre en valeur, nous devons d'abord mettre en place un gestionnaire d'évènement (nous en apprendrons plus [plus tard](/tutorial/dom-events)):

```svelte
/// file: App.svelte
<button +++on:click={increment}+++>
	Il y a eu {count}
	{count === 1 ? 'clic' : 'clics'}
</button>
```

À l'intérieur de la fonction `increment`, nous devons changer la valeur de `count` :

```js
/// file: App.svelte
function increment() {
	+++count += 1;+++
}
```

Svelte "instrumente" cette assignation avec du code qui va informer le <span class="vo">[DOM](SITE_SVELTE/docs/web#dom)</span> de ce qui a besoin d'être mis à jour.
