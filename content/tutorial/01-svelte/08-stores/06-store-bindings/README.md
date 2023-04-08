---
title: Store bindings
---

If a store is writable — i.e. it has a `set` method — you can bind to its value, just as you can bind to local component state.

In this example we're exporting a writable store `name` and a derived store `greeting` from `stores.js`. Update the `<input>` element in `App.svelte`:

```svelte
/// file: App.svelte
<input +++bind:+++value={$name}>
```

Changing the input value will now update `name` and all its dependents.

We can also assign directly to store values inside a component. Add a `<button>` element after the `<input>`:

```svelte
/// file: App.svelte
<button +++on:click={() => $name += '!'}+++>
	Add exclamation mark!
</button>
```

The `$name += '!'` assignment is equivalent to `name.set($name + '!')`.
