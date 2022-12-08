---
title: Error pages
---

If something goes wrong inside a `load` function, SvelteKit will render an error page. In this example, the `/about` route will blow up, because the `load` function in `src/routes/about/+page.server.js` throws an error.

The default error page is somewhat bland. We can customize it by creating a `src/routes/+error.svelte` component:

```svelte
/// file: src/routes/+error.svelte
<script>
	let online = typeof navigator !== 'undefined'
		? navigator.onLine
		: true;
</script>

{#if !online}
	<h1>You're offline</h1>
{:else}
	<h1>Oops!</p>
	<p>Something went wrong</p>
{/if}
```

If you navigate to `/about` to trigger the error, you'll notice that the error page is rendered inside our root `+layout.svelte` component.

We can have more granular error boundaries. Create a new file, `src/routes/about/+error.svelte`:

```svelte
/// file: src/routes/about/+error.svelte
<h1>Something went wrong while rendering the about page</h1>
```

This component will be rendered for `/about`, while the root `+error.svelte` page will be rendered for any other errors that occur.
