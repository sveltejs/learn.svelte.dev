---
title: Textarea inputs
---

> This exercise doesn't currently work. You can switch to the old tutorial instead: https://svelte.dev/tutorial/textarea-inputs

The `<textarea>` element behaves similarly to a text input in Svelte — use `bind:value`:

```svelte
<textarea bind:value={value}></textarea>
```

In cases like these, where the names match, we can also use a shorthand form:

```svelte
<textarea bind:value></textarea>
```

This applies to all bindings, not just textareas.
