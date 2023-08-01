---
title: Blocs else-if
---

Plusieurs conditions peuvent être "chaînées" entre elles avec `else if` :

```svelte
/// file: App.svelte
{#if count > 10}
	<p>{count} est supérieur à 10</p>
+++{:else if count < 5}
	<p>{count} est inférieur à 5</p>
{:else}
	<p>{count} est compris entre 5 et 10</p>
{/if}
```
