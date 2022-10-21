---
title: Customizing the error message
---

The error page in the previous section is rather static. Maybe you want to show the error message so you can help people turning up in your support channels faster.

For this, SvelteKit provides you with `$page.error` and `$page.status`, which contain information about the error and the status code. Let's add it to `+error.svelte`:

```svelte
+++<script>
    import { page } from '$app/stores';
</script>+++
<h2>{$page.status}</h2>
<p>On no, something went wrong!</p>
+++<p>{$page.error.message}</p>
```

That's better, but `$page.error.message` always contains "Internal Error" - how so? This is because SvelteKit plays it safe and prevents you from accidentally showing sensitive information as part of the error message.

To customize it, we implement the `handleError` hook in `hooks.server.js` and `hooks.client.js` which run when an unexpected error is thrown during data loads on the server or client respectively.

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

Note that you can return more than an error message if you like. Whatever object shape you return will be available in `$page.error`, the only requirement is a `message` property. You can even make it type-safe by typing the error object inside `app.d.ts` be defining an `Error` interface with the right shape:

```js
// app.d.ts
declare namespace App {
    interface Error {
        message: string;
        somethingElse: number;
    }
}
```

> When handling errors, be careful to not assume it's an `Error` object, anything could be thrown. Also make sure not to expose senstive data by forwarding too much information
