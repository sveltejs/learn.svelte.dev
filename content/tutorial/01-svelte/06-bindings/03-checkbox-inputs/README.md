---
title: Checkbox inputs
---

Checkboxes are used for toggling between states. Instead of binding to `input.value`, we bind to `input.checked`:

```svelte
/// file: App.svelte
<input type=checkbox +++bind:+++checked={checked} />
```

In cases like these, where the names match, we can also use a shorthand form:

```svelte
/// file: App.svelte
<input type=checkbox +++bind:+++checked />
```

This applies to all bindings, not just input tags.

And of course if we wouldn't want to bind to `input.checked`, we could have reduced `checked={checked}` to `{checked}`. That means, you will commonly see either `{matching}` or `bind:matching` in svelte.