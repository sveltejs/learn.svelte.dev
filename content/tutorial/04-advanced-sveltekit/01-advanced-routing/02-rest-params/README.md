---
title: Rest parameters
---

The number of route segments might be unknown sometimes. Other times, you might want to have a catch-all route for everything that wasn't already matched to another route. For these use cases, use rest parameters.

Rest parameters look like an array spread: `[...rest]`. The variable name inside - in this case `rest` - is available to the `load` function through the `params` object and also through the `$page.params` store.

Let's use this rest parameter to implement a catch-all route to redirect to our better-looking error page instead. First add `[...rest]/+page.js` to `src/routes`:

```diff
src/routes/
+├ [...rest]/
+│ └ +page.svelte
├ +error.svelte
├ +layout.svelte
└ +page.svelte
```

Then add a `load` function to it which throws a 404:

```js
+++import { error } from '@sveltejs/kit';

export function load({ url }) {
	throw error(404, `Page ${url.pathname} not found`);
}+++
```

Now, when the user ends up on a route that isn't know to the app, the catch-all route will be matched, throwing the error, which means we end up on `+error.svelte`.

> This is the recommended pattern for implementing your own 404 page
