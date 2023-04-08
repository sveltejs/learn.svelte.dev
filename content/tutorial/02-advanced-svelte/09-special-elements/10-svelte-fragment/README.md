---
title: <svelte:fragment>
---

The `<svelte:fragment>` element allows you to place content in a named slot without wrapping it in a container DOM element.

In this exercise, we're making a Tic-Tac-Toe game. To form a grid, the `<button>` elements in `App.svelte` should be direct descendants of the `<div class="board">` element in `Board.svelte`.

At the moment, it's horribly broken, because they're children of `<div slot="game">` instead. Let's fix it:

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