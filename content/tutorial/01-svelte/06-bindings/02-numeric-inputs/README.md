---
title: Numeric inputs
---

In the DOM, everything is a string. That's unhelpful when you're dealing with numeric inputs — `type="number"` and `type="range"` — as it means you have to remember to coerce `input.value` before using it.

With `bind:value`, Svelte takes care of it for you:

```svelte
<input type=number bind:value={a} min=0 max=10>
<input type=range bind:value={a} min=0 max=10>
```
Note that you can write
```svelte
<input type=number>
```
or
```svelte
<input type="number">
```
Both ways will work!
