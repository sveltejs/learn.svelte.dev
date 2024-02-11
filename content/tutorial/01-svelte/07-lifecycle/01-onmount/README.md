---
title: onMount
---

Chaque instance de composant possède un _cycle de vie_ qui débute lorsqu'elle est créée, et qui se termine lorsqu'elle est détruite. Il existe plusieurs fonctions qui vous permettent d'exécuter du code à des moments clés de ce cycle de vie. Celle que vous utiliserez le plus souvent est `onMount`, qui s'exécute après le tout premier rendu de l'instance dans le <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span>.

Dans cet exercice, nous avons un `<canvas>` que nous aimerions animer, en utilisant la fonction `paint` dans `gradient.js`. Commencez par importer la fonction `onMount` depuis `svelte` :

```svelte
/// file: App.svelte
<script>
	+++import { onMount } from 'svelte';+++
	import { paint } from './gradient.js';
</script>
```

Ajoutez ensuite un <span class="vo">[callback](PUBLIC_SVELTE_SITE_URL/docs/development#callback)</span> qui s'exécute lorsque le composant est monté :

```svelte
/// file: App.svelte
<script>
	import { onMount } from 'svelte';
	import { paint } from './gradient.js';

+++	onMount(() => {
		const canvas = document.querySelector('canvas');
		const context = canvas.getContext('2d');+++

+++		requestAnimationFrame(function loop(t) {
			requestAnimationFrame(loop);
			paint(context, t);
		});
	});+++
</script>
```

> Dans un [exercice ultérieur] (bind-this), nous apprendrons comment obtenir une référence à un élément sans utiliser `document.querySelector`.

Jusque ici, tout va bien - vous devriez voir des couleurs légèrement ondulantes dans la forme du logo Svelte. Mais il y a un problème - la boucle continuera même après que le composant ait été détruit. Pour résoudre ce problème, nous devons renvoyer une fonction de nettoyage à partir de `onMount` :

```js
/// file: App.svelte
onMount(() => {
	const canvas = document.querySelector('canvas')
	const context = canvas.getContext('2d');

	+++let frame =+++ requestAnimationFrame(function loop(t) {
		+++frame =+++ requestAnimationFrame(loop);
		paint(context, t);
	});

+++	return () => {
		cancelAnimationFrame(frame);
	};+++
});
```
