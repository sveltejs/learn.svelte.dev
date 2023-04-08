---
title: Textarea inputs
---

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
