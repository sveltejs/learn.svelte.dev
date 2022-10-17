---
title: Loading Data
---

So far, we have seen how to create pages and layouts with static UI data. Most of your apps need to load some kind of data however. You could do this with a regular `fetch` inside `onMount`. That doesn't work with server-side-rendering or prerendering though, and you'd have half-finished pages loading data only after they are rendered.

SvelteKit provides a better way to do this through `load` functions.

This `load` function can appear in several places. Let's start with the `load` function inside `+page.js`.

This `load` function runs on the server when the user visits your page initially, and on the client for all further navigations - it's isomorphic. We call it a "shared `load` function". To harmonize the differences between client and server, use the `fetch` function passed to `load` to load data. The return type of the `load` function needs to be an object at the top level, below that everything is allowed. If we return a promise, it's awaited. The result is passed to the `data` prop inside `+page.svelte`, so we can access it through `export let data`.

Let's move the call inside `src/routes/+page.svelte` into `+page.js`:

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

```js
+++export async function load({ fetch }) {
	const greeting = await fetch('/api').then((r) => r.text());
	return { greeting };
}+++
```
