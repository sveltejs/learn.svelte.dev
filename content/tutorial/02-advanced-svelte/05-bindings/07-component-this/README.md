---
title: Liaisons d'instance de composant
---

De la même façon que vous pouvez créer des liaisons avec les éléments <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span>, vous pouvez créer des liaisons avec les instances de composants elles-mêmes en utilisant `bind:this`.

Cela est pratique dans les rares cas où vous avez besoin d'interagir avec un composant programmatiquement (plutôt qu'en lui fournissant de nouvelles <span class="vo">[props](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#props)</span>). Revenons à notre application de canvas croisée [il y a quelques exercices](actions). Une fonctionnalité sympa pourrait être d'ajouter un bouton pour effacer l'écran.

D'abord, exportons une fonction depuis `Canvas.svelte` :

```svelte
/// file: Canvas.svelte
export let color;
export let size;

+++export function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}+++
```

Ensuite, créez une référence à l'instance du composant :

```svelte
/// file: App.svelte
<script>
	import Canvas from './Canvas.svelte';
	import { trapFocus } from './actions.js';

	const colors = ["rouge", "orange", "jaune", "vert", "bleu", "indigo", "violet", "blanc", "noir"];
	let selected = colors[0];
	let size = 10;

	let showMenu = true;
	+++let canvas;+++
</script>

<div class="container">
	<Canvas +++bind:this={canvas}+++ color={selected} size={size} />
```

Enfin, ajoutez un bouton qui appelle la fonction `clear` :

```svelte
/// file: App.svelte
<div class="controls">
	<button class="show-menu" on:click={() => showMenu = !showMenu}>
		{showMenu ? 'fermer' : 'menu'}
	</button>

+++	<button on:click={() => canvas.clear()}>
		effacer
	</button>+++
</div>
```
