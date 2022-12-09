---
title: Customizing the error message
---

The error page in the previous exercise is rather static. Maybe you want to show the error message so you can help people turning up in your support channels faster.

For this, SvelteKit provides you with `$page.error` and `$page.status`, which contain information about the error and the status code. Let's add it to `+error.svelte`:

```svelte
/// file: src/routes/+error.svelte
<script>
	+++import { page } from '$app/stores';+++

	let online = typeof navigator !== 'undefined'
		? navigator.onLine
		: true;
</script>

+++{#if $page.status === 404}
	<h1>Not found</h1>
{:else +++if !online}
	<h1>You're offline</h1>
{:else}
	<h1>Oops!</h1>
	---<p>Something went wrong</p>---
	+++<p>{$page.error.message}</p>+++
{/if}
```

That's better, but `$page.error.message` always contains "Internal Error" - how so? This is because SvelteKit plays it safe and prevents you from accidentally showing sensitive information as part of the error message.

To customize it, implement the `handleError` hook in `hooks.server.js` and `hooks.client.js` which run when an unexpected error is thrown during data loads on the server or client respectively.

```js
// hooks.server.js
export function handleError(+++{ error }+++) {
    ---return { message: 'Internal Error' }; // the default implementation of this hook---
    +++return { message: error instanceof Error ? error.message : 'Internal Error' };+++
}
```

```js
// hooks.client.js
export function handleError(+++{ error }+++) {
    ---return { message: 'Internal Error' }; // the default implementation of this hook---
    +++return { message: error instanceof Error ? error.message : 'Internal Error' };+++
}
```

You could also call your error reporting service in these hooks.

Note that you can return more than an error message if you like. Whatever object shape you return will be available in `$page.error`, the only requirement is a `message` property. You can read more about this (and how to make it type-safe!) in the [error docs](https://kit.svelte.dev/docs/errors).

> When handling errors, be careful to not assume it's an `Error` object, anything could be thrown. Also make sure not to expose senstive data by forwarding too much information
