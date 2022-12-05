---
title: Loading data
---

So far, we have seen how to create pages and layouts with static UI data. Most of your apps need to load some kind of data. You could do this with a regular `fetch` inside `onMount`. However, that doesn't work with server-side-rendering or prerendering, and you'd end up with half-finished pages that load data only after they are rendered.

SvelteKit provides a better way to do this through `load` functions.

This `load` function can appear in several places. Let's start with the `load` function inside `+page.js`.

This `load` function runs on the server when the user visits your page initially, and on the client for all further navigations - it's isomorphic. We call it a "shared `load` function". To make sure it works the same way in the client and server, use the `fetch` function passed into `load` to fetch data.

The return type of the `load` function needs to be an object at the top level, below that everything is allowed. If we return a promise, it's awaited. The result is passed to the `data` prop inside `+page.svelte`, so we can access it through `export let data`.

Let's move the call inside `src/routes/+page.svelte` into `+page.js`. First, create the file:

```diff
src/routes/
+  +page.js
  +page.svelte
```

Then, move the call into the `load` function:

```js
+++export async function load({ fetch }) {
	const greeting = await fetch('/api').then((r) => r.text());
	return { greeting };
}+++
```

```svelte
<script>
---	import { onMount } from 'svelte';

	let greeting;
	onMount(async () => {
		greeting = await fetch('/api').then((r) =>
			r.text()
		);
	});---
+++ export let data;+++
</script>

<p>{+++data.+++greeting}</p>
```
