---
title: <svelte:fragment>
---

L'élément `<svelte:fragment>` vous permet de placer du contenu dans un <span class="vo">[slot](SVELTE_SITE_URL/docs/sveltejs#slot)</span> nommé sans l'entourer dans un élément de <span class="vo">[DOM](SVELTE_SITE_URL/docs/web#dom)</span> supplémentaire. Cela permet de garder intacte la structure hiérarchique de votre document.

Dans cet exercice, nous construisons un morpion. Pour former une grille, les éléments `<button>` de `App.svelte` doivent être des descendants directs de l'élément `<div class="board">` dans `Board.svelte`.

Pour le moment, tout est affreusement cassé, parce que les éléments `<button>` sont des enfants de `<div slot="game">`. Réglons ce problème :

```svelte
/// file: App.svelte
<+++svelte:fragment+++ slot="game">
	{#each squares as square, i}
		<button
			class="square"
			class:winning={winningLine?.includes(i)}
			disabled={square}
			on:click={() => {
				squares[i] = next;
				next = next === 'x' ? 'o' : 'x';
			}}
		>
			{square}
		</button>
	{/each}
</+++svelte:fragment+++>
```
