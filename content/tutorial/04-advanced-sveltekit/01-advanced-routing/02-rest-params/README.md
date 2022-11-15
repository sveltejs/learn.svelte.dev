---
title: Rest Parameters
---

The number of route segments might be unknown sometimes. Other times, you might want to have a catch-all route for everything that wasn't already matched to another route. For these use cases, use rest parameters.

Rest parameters look like an array spread: `[...rest]`. The variable name inside - in this case `rest` - is available to the `load` function through the `params` object and also through the `$page.params` store.

Let's use this rest parameter to implement a catch-all route to redirect to our nice-look error page instead. Add the following to `[...rest]/+page.js`:

```js
+++import { error } from '@sveltejs/kit';

export function load() {
	throw error(404, 'Page not found');
}+++
```

Now, when the user ends up on a route that isn't know to the app, the catch-all route will be matched, throwing the error, which means we end up on `+error.svelte`.

> This is the recommended pattern for implementing your own 404 page
