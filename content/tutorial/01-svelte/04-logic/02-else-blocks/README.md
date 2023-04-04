---
title: Else blocks
---

Just like in JavaScript, an `if` block can have an `else` block:

```svelte
/// file: App.svelte
{#if count > 10}
	<p>{count} is greater than 10</p>
+++{:else}
	<p>{count} is between 0 and 10</p>+++
{/if}
```

> A `#` character always indicates a _block opening_ tag. A `/` character always indicates a _block closing_ tag. A `:` character, as in `{:else}`, indicates a _block continuation_ tag. Don't worry — you've already learned almost all the syntax Svelte adds to HTML.
