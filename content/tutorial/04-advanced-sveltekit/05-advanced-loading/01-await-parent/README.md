---
title: Using parent data
---

Occasionally it's useful for a `load` function to access data from a parent `load` function, which can be done with `await parent()`.

Let's use that to implement a simple sum spread out over different server `load` functions:

```js
/// file: src/abc/+layout.js
export async function load(+++{ parent }+++) {
	+++const { a } = await parent();
	return { b: a + 1 };+++
}
```

```js
/// file: src/abc/+page.js
export async function load(+++{ parent }++) {
	+++const { a, b } = await parent();
	return { c: a + b };+++
}
```

Inside `+page.server.js` and `+layout.server.js`, `await parent()` returns data from parent `+layout.server.js` files.

In `+page.js` or `+layout.js` it will return data from parent `+layout.js` files. However, a missing `+layout.js` is treated as a `({ data }) => data` function, meaning that it will also return data from parent `+layout.server.js` files that are not 'shadowed' by a `+layout.js` file.

> Take care not to introduce waterfalls when using `await parent()`. If you can `fetch` other data that is not dependent on parent data, do that first.
