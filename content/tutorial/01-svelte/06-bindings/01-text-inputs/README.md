---
title: Text inputs
---

As a general rule, data flow in Svelte is _top down_ — a parent component can set props on a child component, and a component can set attributes on an element, but not the other way around.

Sometimes it's useful to break that rule. Take the case of the `<input>` element in this component — we _could_ add an `on:input` event handler that sets the value of `name` to `event.target.value`, but it's a bit... boilerplatey. It gets even worse with other form elements, as we'll see.

Instead, we can use the `bind:value` directive:

```svelte
/// file: App.svelte
<input +++bind:+++value={name}>
```

This means that a change to the value of `name` will be reflected in the input field, and conversely, a change made in the input field will update the value of `name`.
