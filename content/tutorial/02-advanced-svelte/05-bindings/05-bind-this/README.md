---
title: This
---

Dans un [exercice précédent](onmount), nous avons vu comment utiliser la méthode de cycle de vie `onMount` pour dessiner dans un `<canvas>`.

Mais l'exemple est [buggué](SVELTE_SITE_URL/docs/development#bug) — il utilise `document.querySelector('canvas')`, qui renvoie toujours le premier `<canvas>` trouvé dans la page, qui pourrait très bien ne pas être celui appartenant à notre composant.

À la place, nous pouvons utiliser la liaison en lecture seule `this` pour obtenir une référence au bon élément :

```js
/// file: App.svelte
+++let canvas;+++

onMount(() => {
	---const canvas = document.querySelector('canvas')---
	const context = canvas.getContext('2d');

	let frame = requestAnimationFrame(function loop(t) {
		frame = requestAnimationFrame(loop);
		paint(context, t);
	});

	return () => {
		cancelAnimationFrame(frame);
	};
});
```

```svelte
/// file: App.svelte
<canvas
	+++bind:this={canvas}+++
	width={32}
	height={32}
></canvas>
```

Notez que la valeur de `canvas` sera `undefined` jusqu'au montage du composant.
