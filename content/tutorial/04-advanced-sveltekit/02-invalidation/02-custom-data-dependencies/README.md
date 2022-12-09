---
title: Custom data dependencies
---

Sometimes you can't or don't want to get data using `fetch`, which means that there's no `url` registered automatically as a `load` dependency which you could `invalidate`. In this case, use `depends` to register a `url` manually.

Did you know that `foo:bar` is a valid `url`? We can use this to our advantage to create valid custom `url`s that are readable. Let's do that to move our "calculation" of the current time into the `load` function:

```js
/// file: src/routes/+page.js
export async function load({ ---fetch---+++depends+++ }) {
    ---const response = await fetch('/api/clock');
	return response.json();---
	+++depends('tick:tock');
	return {
		time: new Date().toLocaleTimeString()
	};+++
}
```

```svelte
/// file: src/routes/+page.svelte
<script>
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		const interval = setInterval(
			() => invalidate(---'/api/clock'---+++'tick:tock'+++),
			1000
		);
		return () => clearInterval(interval);
	});
</script>

<div>{data.time}</div>
```
