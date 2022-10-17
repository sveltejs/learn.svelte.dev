---
title: Loading Layout Data
---

Layouts can provide common UI across pages. They can also provide common data across pages.

Providing this data is similar to the `load` function in `+page.js`, only that we place it inside `+layout.js` - notice the symmetry?

Like in `+page.js`, this `load` function runs on the server when the user visits your page initially, and on the client for all further navigations - it's isomorphic. We call it a "shared `load` function". To harmonize the differences between client and server, use the `fetch` function passed to `load` to load data. The return type of the `load` function needs to be an object at the top level, below that everything is allowed. If we return a promise, it's awaited. The result is passed to the `data` prop inside `+layout.svelte`, so we can access it through `export let data`.

Let's make the same call inside `src/routes/+layout.js` as we are already doing in `src/routes/+page.js`, switch the search param from `page` to `layout`:

```svelte
+++<script>
	export let data;
</script>
+++
<h1>---TODO---+++{data.greeting}+++</h1>
```

```js
+++export async function load({ fetch }) {
	const greeting = await fetch('/api?layout').then((r) => r.text());
	return { greeting };
}+++
```

> The data for `+page.js` and `+layout.js` will be loaded in parallel, so your UI renders faster
