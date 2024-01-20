---
title: Textarea inputs
---

Important: If following this tutorial locally, you will need to install the `marked` dependency using your package manager (e.g. `npm install marked`)

The `<textarea>` element behaves similarly to a text input in Svelte — use `bind:value`:

```svelte
/// file: App.svelte
<textarea +++bind:value=+++{value}></textarea>
```

In cases like these, where the names match, we can also use a shorthand form:

```svelte
/// file: App.svelte
<textarea +++bind:value+++></textarea>
```

This applies to all bindings, not just textareas.
