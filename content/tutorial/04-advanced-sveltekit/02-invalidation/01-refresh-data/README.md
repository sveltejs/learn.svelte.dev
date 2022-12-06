---
title: Refreshing data
---

When SvelteKit navigates to a site, it runs the related `load` functions. After some time, that data might become stale, so we want to refresh it. This is possible using `invalidate` or `invalidateAll`.

Let's start with `invalidate`. You call it inside a component with a `url`. All `load` functions that have a dependency on this `url` will then be rerun. This works nicely in combination with `fetch`, which registers the `url` as a dependency of the `load` function.

Let's get the clock in our example ticking by first fetching some data in `+page.js`...

```js
export async function load({ fetch }) {
    +++const response = await fetch('/api/clock');
    return response.json();+++
}
```

...and refreshing that data every second inside our component by using `invalidate` and passing the same `url` we passed to `fetch`.

```svelte
<script>
    +++import { invalidate } from '$app/navigation';
    import { onMount } from 'svelte';+++

    export let data;

    +++onMount(() => {
        const interval = setInterval(
            () => invalidate('/api/clock'),
            1000
        );
        return () => clearInterval(interval);
    });+++
</script>

<div>{data.time}</div>
```

> You can also pass a function to `invalidate`, in case you want to invalidate based on a pattern and not specific URLs
