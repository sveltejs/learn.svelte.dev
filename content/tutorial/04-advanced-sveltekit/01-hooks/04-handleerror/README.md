---
title: handleError
---

The `handleError` hook lets you intercept unexpected errors and trigger some behaviour, like pinging a Slack channel or sending data to an error logging service.

As you'll recall from an [earlier exercise](error-basics), an error is _unexpected_ if it wasn't created with the `error` helper from `@sveltejs/kit`. It generally means something in your app needs fixing. The default behaviour is to log the error:

```js
/// file: src/hooks.server.js
export function handleError({ event, error }) {
	console.error(error.stack);
}
```

If you navigate to `/the-bad-place`, you'll see this in action — the error page is shown, and if you open the terminal (using the button to the right of the URL bar), you'll see the message from `src/routes/the-bad-place/+page.server.js`.

Notice that we're _not_ showing the error message to the user. That's because error messages can include sensitive information that at best will confuse your users, and at worst could benefit evildoers. Instead, the error object available to your application — represented as `$page.error` in your `+error.svelte` pages, or `%sveltekit.error%` in your `src/error.html` fallback — is just this:

```js
/// no-file
{
	message: 'Internal Error' // or 'Not Found' for a 404
}
```

In some situations you way want to customise this object. To do so, you can return an object from `handleError`:

```js
/// file: src/hooks.server.js
export function handleError({ event, error }) {
	console.error(error.stack);

	return {
		message: 'everything is fine',
		code: 'JEREMYBEARIMY'
	};
}
```

You can now reference properties other than `message` in a custom error page. Create `src/routes/+error.svelte`:

```svelte
/// file: src/routes/+error.svelte
<script>
	import { page } from '$app/stores';
</script>

<h1>{$page.status}</h1>
<p>{$page.error.message}</p>
<p>error code: {$page.error.code}</p>
```