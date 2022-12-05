---
title: Loading data on the server
---

We have seen how to load data for pages and layouts through `load` functions in `+page.js` and `+layout.js`. These functions run on both the server and the client. This has some advantages but also some drawbacks, for example you can't directly query your database, you have to use `fetch`.

Luckily, SvelteKit provides a way to run a `load` _only_ on the server so you can access all your server-related data directly, by placing it inside `+page.server.js`. We call it a "server-only `load` function". The return type of the `load` function needs to be an object at the top level, and it needs to be serializable with [`devalue`](https://www.npmjs.com/package/devalue), which means JSON-objects and some JavaScript objects like `Date`s are allowed, but not custom classes for example. If we return a promise, it's awaited. The result is passed to the `data` prop inside `+page.svelte`, so we can access it through `export let data`.

Create a `+page.server.js` file next to `+page.svelte`:

```diff
src/routes/
+  +page.server.js
  +page.svelte
```

Then make a call to our fake database inside `src/routes/+page.server.js` and show the result in `src/routes/+page.svelte`:

```js
import { db } from './fake-db.js';

+++export async function load() {
	const greeting = await db.greet();
	return { greeting };
}+++
```

```svelte
+++<script>
	export let data
</script>
+++
<p>---TODO---+++{data.greeting}+++</p>
```

> Noticed how we can place `fake-db.js` right next to our page and layout files without risking to accidentally creating another route? This is one of several advantages of the "`+X` creates a route-related file"-convention
