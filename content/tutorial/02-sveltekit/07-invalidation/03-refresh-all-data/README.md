---
title: Refresh all data
---

Sometimes you want to refresh all data across the site, regardless of any `url` dependencies. For this, use `invalidateAll`.

Let's use `invalidateAll` in our clock example. First we'll update the component:

```svelte
<script>
	import { ---invalidate---+++invalidateAll+++ } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		const interval = setInterval(
			() => ---invalidate('tick:tock')---+++invalidateAll()+++,
			1000
		);
		return () => clearInterval(interval);
	});
</script>

<div>{data.time}</div>
```

Since `invalidateAll` runs _all_ `load` functions regardless of their `url` dependencies, we can simplify the code in `+page.js` by removing the `depends` call:

```js
export async function load(---{ depends }---) {
    ---depends('tick:tock');---
	return {
		time: new Date().toLocaleTimeString()
	};
}
```

> `invalidate(() => true)` and `invalidateAll` are _not_ the same. `invalidateAll` also reruns `load` functions without any `url` dependencies, which `invalidate(() => true)` wouldn't
