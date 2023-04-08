---
title: Else-if blocks
---

Multiple conditions can be 'chained' together with `else if`:

```svelte
/// file: App.svelte
{#if count > 10}
	<p>{count} is greater than 10</p>
+++{:else if count < 5}
	<p>{count} is less than 5</p>+++
{:else}
	<p>{count} is between +++5+++ and 10</p>
{/if}
```
