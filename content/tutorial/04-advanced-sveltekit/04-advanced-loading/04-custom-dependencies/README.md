---
title: Custom dependencies
path: /Europe/London
---

Calling `fetch(url)` inside a `load` function registers `url` as a dependency. Sometimes it's not appropriate to use `fetch`, in which case you can specify a dependency manually with the [`depends(url)`](https://kit.svelte.dev/docs/load#invalidation-manual-invalidation) function.

Since any string that begins with an `[a-z]+:` pattern is a valid URL, we can create custom invalidation keys like `data:now`.

Update `src/routes/+layout.js` to return a value directly rather than making a `fetch` call, and add the `depends`:

```js
/// file: src/routes/+layout.js
export async function load({ +++depends+++ }) {
	+++depends('data:now');+++

	return {
		now: +++Date.now()+++
	};
}
```

Now, update the `invalidate` call in `src/routes/[...timezone]/+page.svelte`:

```svelte
/// file: src/routes/[...timezone]/+page.svelte
<script>
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';

	export let data;

	onMount(() => {
		const interval = setInterval(() => {
			invalidate(+++'data:now'+++);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>
```
