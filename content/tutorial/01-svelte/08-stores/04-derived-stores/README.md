---
title: Derived stores
---

You can create a store whose value is based on the value of one or more _other_ stores with `derived`. Building on our previous example, we can create a store that derives the time the page has been open:

```js
/// file: stores.js
export const elapsed = derived(
    time,
    ($time) => +++Math.round(($time - start) / 1000)+++
);
```

> It's possible to derive a store from multiple input stores, and to explicitly `set` a value instead of returning it (which is useful for deriving values asynchronously). Consult the [API reference](https://svelte.dev/docs#run-time-svelte-store-derived) for more information.

> Make sure all definitions from the stores a store derives from are **before** your derived store definition. Otherwise you might end up with a `ReferenceError: Cannot access uninitialized variable.`
