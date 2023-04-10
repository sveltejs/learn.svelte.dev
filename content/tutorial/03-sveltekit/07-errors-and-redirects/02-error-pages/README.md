---
title: Error pages
---

When something goes wrong inside a `load` function, SvelteKit renders an error page.

The default error page is somewhat bland. We can customize it by creating a `src/routes/+error.svelte` component:

```svelte
/// file: src/routes/+error.svelte
<script>
	import { page } from '$app/stores';
	import { emojis } from './emojis.js';
</script>

<h1>{$page.status} {$page.error.message}</h1>
<span style="font-size: 10em">
	{emojis[$page.status] ?? emojis[500]}
</span>
```

> We're using the `page` store, which we'll learn more about in a later chapter.

Notice that the `+error.svelte` component is rendered inside the root `+layout.svelte`. We can create more granular `+error.svelte` boundaries:

```svelte
/// file: src/routes/expected/+error.svelte
<h1>this error was expected</h1>
```

This component will be rendered for `/expected`, while the root `src/routes/+error.svelte` page will be rendered for any other errors that occur.
