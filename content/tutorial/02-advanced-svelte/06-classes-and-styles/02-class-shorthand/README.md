---
title: La directive de classe raccourcie
---

Souvent, le nom de la classe sera le même que celui de la variable dont elle dépend :

```svelte
/// no-file
<button
	class="card"
	class:flipped={flipped}
	on:click={() => flipped = !flipped}
>
```

Dans ce cas-là, nous pouvons utiliser la forme raccourcie :

```svelte
/// file: App.svelte
<button
	class="card"
	+++class:flipped+++
	on:click={() => flipped = !flipped}
>
```
