---
title: Else-if blocks
---

Multiple conditions can be 'chained' together with `else if`:

```svelte
/// file: App.svelte
{#if x > 10}
	<p>{x} is greater than 10</p>
{:+++else if+++ 5 > x}
	<p>{x} is less than 5</p>
{:else}
	<p>{x} is between 5 and 10</p>
{/if}
```
