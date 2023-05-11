---
title: Textarea inputs
---

The `<textarea>` element behaves similarly to a text input in Svelte — use `bind:value`:

```svelte
/// file: App.svelte
<textarea +++bind:value+++></textarea>
```

Remember, `bind:value` is a shorthand form for `bind:value={value}`.