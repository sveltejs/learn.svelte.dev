---
title: Keyed each blocks
---

By default, when you modify the value of an `each` block, it will add and remove DOM nodes at the _end_ of the block, and update any values that have changed. That might not be what you want.

It's easier to show why than to explain. The `<Thing>` component sets the emoji as a constant on initialization, but the name is passed in via a prop.

Click the 'Remove first thing' button a few times, and notice what happens:

1. It removes the last component.
2. It then updates the `name` value in the remaining DOM nodes, but not the emoji, which is fixed when each `<Thing>` is created.

Instead, we'd like to remove only the first `<Thing>` component and its DOM node, and leave the others unaffected.

To do that, we specify a unique identifier (or "key") for each iteration of the `each` block:

```svelte
/// file: App.svelte
{#each things as thing (+++thing.id+++)}
	<Thing name={thing.name}/>
{/each}
```

Here, `(thing.id)` is the _key_, which tells Svelte how to figure out what to update when the values (`name` in this example) change.

> You can use any object as the key, as Svelte uses a `Map` internally — in other words you could do `(thing)` instead of `(thing.id)`. Using a string or number is generally safer, however, since it means identity persists without referential equality, for example when updating with fresh data from an API server.
