---
title: Loading Layout Data
---

Layouts can provide common UI across pages. They can also provide common data across pages.

Providing this data is similar to the `load` function in `+page.js`, only that we place it inside `+layout.js` - notice the symmetry?

This `load` function works the same as the `load` function in `+page.js`.

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
