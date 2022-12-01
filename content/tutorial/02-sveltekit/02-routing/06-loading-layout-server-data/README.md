---
title: Loading Layout Data on the Server
---

Layouts can also be provided with data. Like pages, they can get it from a shared `load` function or a server-only `load` function.

If you have worked through the previous tutorial chapters in order, you may notice a pattern by now:

- Load data for a page inside `+page.js` or `+page.server.js`
- Load data for a layout inside `+layout.js` or `+layout.server.js`

In this chapter, we look at the last of those four possibilities by placing the `load` function inside `+layout.server.js`. First, create that file next to the `+layout.svelte` file:

```diff
src/routes/
+  +layout.server.js
  +layout.svelte
  +page.svelte
```

Then make a call to our fake database inside `src/routes/+layout.server.js` and show the result in `src/routes/+layout.svelte`:

```js
+++import { db } from './fake-db.js';

export async function load() {
	const greeting = await db.getGreeting('layout');
	return { greeting };
}+++
```

```svelte
+++<script>
	export let data
</script>
+++
<h1>---TODO---+++{data.greeting}+++</h1>
```

> The `load` functions in `+page.server.js` and `+layout.server.js` files will be called in parallel, so your UI renders faster
