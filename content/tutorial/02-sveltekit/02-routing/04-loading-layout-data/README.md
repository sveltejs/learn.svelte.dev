---
title: Loading Layout Data
---

Layouts can provide common UI across pages. They, too, can make use of `load` functions.

Providing this data is similar to the `load` function in `+page.js`, only that we place it inside `+layout.js` - notice the symmetry?

This `load` function works the same as the `load` function in `+page.js`.

Let's make the same call inside `src/routes/+layout.js` as we did in the previous chapter in `src/routes/+page.js`. First, create the `+layout.js` file:

```diff
src/routes/
+  +layout.js
  +layout.svelte
  +page.svelte
```

Then add the `load` function, calling the API inside, and passing the result to `+layout.svelte` for display:

```js
+++export async function load({ fetch }) {
	const greeting = await fetch('/api?layout').then((r) => r.text());
	return { greeting };
}+++
```

```svelte
+++<script>
	export let data;
</script>
+++
<h1>---TODO---+++{data.greeting}+++</h1>
```

> The `load` functions in `+page.js` and `+layout.js` files will be called in parallel, so your UI renders faster
