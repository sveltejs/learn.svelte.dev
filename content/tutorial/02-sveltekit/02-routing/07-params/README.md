---
title: Route Parameters
---

Many URLs are static, but sometimes it's useful to make them dynamic at certain parts of the URL. This is where route parameters come in.

A route parameter is created by adding square brackets around a valid variable name. For a route like `src/routes/[foo]/bar/+page.svelte`, resulting valid URLs are `a/bar`, `b/bar`, `c/bar`, ... and so on.

Let's create such a route with a parameter. First add `[page]/+page.svelte` and a corresponding `[page]/+page.js`...

```diff
src/routes/
+├ [page]/
+│ ├ +page.js
+│ └ +page.svelte
├ +layout.svelte
└ +page.svelte
```

...then access the `page` parameter through the `params` object in the `load` function...

```js
// [page]/+page.js
export function load({ params }) {
	return { page: 'You are on page ' + params.page };
}
```

...and display the data in `[page]/+page.svelte`:

```html
<script>
	export let data;
</script>

<p>{data.page}</p>
```

> Multiple route parameters can appear _within_ one URL segment, as long as they are separated by at least one static character: `foo/[bar]x[baz]` is a valid route where `[bar]` and `[bar]` are dynamic parameters.
