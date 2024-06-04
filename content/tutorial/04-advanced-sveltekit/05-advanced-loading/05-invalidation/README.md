---
title: Invalidation
path: /Europe/London
---

When the user navigates from one page to another, SvelteKit calls your `load` functions, but only if it thinks something has changed.

In this example, navigating between timezones causes the `load` function in `src/routes/[...timezone]/+page.js` to re-run because `params.timezone` is invalid. But the `load` function in `src/routes/+layout.js` does _not_ re-run, because as far as SvelteKit is concerned it wasn't invalidated by the navigation.

We can fix that by manually invalidating it using the [`invalidate(...)`](https://kit.svelte.dev/docs/modules#$app-navigation-invalidate) function, which takes a URL and re-runs any `load` functions that depend on it. Because the `load` function in `src/routes/+layout.js` calls `fetch('/api/now')`, it depends on `/api/now`.

In `src/routes/[...timezone]/+page.svelte`, add an `onMount` callback that calls `invalidate('/api/now')` once a second:

```svelte
/// file: src/routes/[...timezone]/+page.svelte
<script>
	+++import { onMount } from 'svelte';+++
	+++import { invalidate } from '$app/navigation';+++

	export let data;

+++	onMount(() => {
		const interval = setInterval(() => {
			invalidate('/api/now');
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});+++
</script>

<h1>
	{new Intl.DateTimeFormat([], {
		timeStyle: 'full',
		timeZone: data.timezone
	}).format(new Date(data.now))}
</h1>
```

> You can also pass a function to `invalidate`, in case you want to invalidate based on a pattern and not specific URLs
