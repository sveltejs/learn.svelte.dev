---
title: setContext et getContext
---

L'<span class="vo">[API](PUBLIC_SVELTE_SITE_URL/docs/development#api)</span> de contexte fournit un mécanisme permettant aux composants de communiquer entre eux sans avoir besoin de faire "voyager" la donnée ou les fonctions en tant que props ou générer beaucoup d'évènements. C'est une fonctionnalité avancée, mais utile. Dans cet exercice, nous allons recréer [Schotter] (https://collections.vam.ac.uk/item/O221321/schotter-print-nees-georg/) par George Nees — un des pioniers de l'art génératif — en utilisant l'API de contexte.

Dans `Canvas.svelte`, il y a une fonction `addItem` qui ajoute un élément au canvas. Nous pouvons la rendre accessible aux composants à l'intérieur de `<Canvas>`, comme `<Square>`, avec `setContext` :

```svelte
/// file: Canvas.svelte
<script>
	import { +++setContext+++, afterUpdate, onMount, tick } from 'svelte';

	// ...

	onMount(() => {
		ctx = canvas.getContext('2d');
	});

+++	setContext('canvas', {
		addItem
	});+++

	function addItem(fn) {...}

	function draw() {...}
</script>
```

À l'intérieur des composants enfants, nous pouvons maintenant récupérer le contexte avec `getContext`:

```svelte
/// file: Square.svelte
<script>
	+++import { getContext } from 'svelte';+++

	export let x;
	export let y;
	export let size;
	export let rotate;

	+++getContext('canvas').addItem(draw);+++

	function draw(ctx) {...}
</script>
```

Jusque là, c'est plutôt... ennuyeux. Ajoutons un peu d'aléatoire à la grille :

```svelte
/// file: App.svelte
<div class="container">
	<Canvas width={800} height={1200}>
		{#each Array(12) as _, c}
			{#each Array(22) as _, r}
				<Square
					x={180 + c * 40+++ + jitter(r * 2)+++}
					y={180 + r * 40+++ + jitter(r * 2)+++}
					size={40}
					+++rotate={jitter(r * 0.05)}+++
				/>
			{/each}
		{/each}
	</Canvas>
</div>
```

Comme pour les [fonctions de cycle de vie](/tutorial/onmount), `setContext` et `getContext` doivent être appelées pendant l'initialisation du composant. La clé de contexte (`'canvas'` dans ce cas) peut être n'importe quoi, même autre chose qu'une <span class="vo">[string](PUBLIC_SVELTE_SITE_URL/docs/development#string)</span>, ce qui est pratique pour contrôler qui a le droit d'accéder au contexte.

Votre objet de contexte peut inclure n'importe quoi, y compris des <span class="vo">[stores](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#store)</span>. Cela vous permet de passer aux composants enfants des valeurs qui peuvent changer au cours du temps :

```js
/// no-file
// dans un composant parent
import { setContext } from 'svelte';
import { writable } from 'svelte/store';

setContext('my-context', {
	count: writable(0)
});
```
```js
/// no-file
// dans un composant enfant
import { getContext } from 'svelte';

const { count } = getContext('my-context');

$: console.log({ count: $count });
```
