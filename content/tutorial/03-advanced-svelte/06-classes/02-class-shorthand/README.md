---
title: Shorthand class directive
---

Often, the name of the class will be the same as the name of the value it depends on:

```svelte
/// no-file
<div class:big={big}>
```

In those cases we can use a shorthand form:

```svelte
/// file: App.svelte
<div +++class:big+++>
	some {big ? 'big' : 'small'} text
</div>
```
