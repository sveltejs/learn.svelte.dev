---
title: onDestroy
---

There are some things in JavaScript that can cause memory leaks if not explicitly cleaned up. For example, `setInterval`, which repeatedly executes a passed function, etc.

Here we call `setInterval` in the `Timer` component. Click the `Open Timer` button, make sure the `count` increments, then click `Close Timer`. The `Timer` component is destroyed, but the `count` continues to increment. This is due to a memory leak as the previous timers are not deleted. We would like to clean this up.

To run code when your component is destroyed, use `onDestroy`.

> Don't forget to click `reload` button (round arrow icon) before solving the example.

```svelte
/// file: Timer.svelte
<script>
+++	import { onDestroy } from 'svelte';+++

	export let callback;
	const interval = setInterval(callback, 1000);

+++	onDestroy(() => clearInterval(interval));+++
</script>
```
