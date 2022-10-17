---
title: Loading Layout Data on the Server
---

Layouts can provide common UI across pages. They can also provide common data across pages. Like pages, they can do so from a shared `load` function or a server-only `load` function.

If you have worked through the previous tutorial chapters in order, you may notice a pattern by now:

- Load data for a page inside `+page.js` or `+page.server.js`
- Load data for a layout inside `+layout.js` or `+layout.server.js`

In this chapter, we look at the last of those four possibilities by placing the `load` function inside `+layout.server.js`. We call it a "server-only `load` function". The return type of the `load` function needs to be an object at the top level, and it needs to be serializable with `devalue`, which means JSON-objects and some JavaScript objects like `Date`s are allowed, but not custom classes for example. If we return a promise, it's awaited. The result is passed to the `data` prop inside `+layout.svelte`, so we can access it through `export let data`.

Let's make a call to our fake database inside `src/routes/+layout.server.js` and show the result in `src/routes/+layout.svelte`:

```svelte
+++<script>
	export let data
</script>
+++
<p>---TODO---+++{data.greeting}+++</p>
```

```js
import { db } from './fake-db.js';

+++export async function load() {
	const greeting = await db.getGreeting('layout');
	return { greeting };
}+++
```

> The data for `+page.server.js` and `+layout.server.js` will be loaded in parallel, so your UI renders faster
