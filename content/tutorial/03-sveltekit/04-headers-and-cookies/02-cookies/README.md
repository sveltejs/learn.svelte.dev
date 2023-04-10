---
title: Reading and writing cookies
---

The [`setHeaders`](headers) function can't be used with the `Set-Cookie` header. Instead, you should use the `cookies` API.

In your `load` functions, you can read a cookie with `cookies.get(name, options)`:

```js
/// file: src/routes/+page.server.js
export function load(+++{ cookies }+++) {
	+++const visited = cookies.get('visited');+++

	return {
		visited
	};
}
```

To set a cookie, you `cookies.set(name, value, options)`. It's strongly recommended that you explicitly configure the `path` when setting a cookie, since browsers' default behaviour — somewhat uselessly — is to set the cookie on the parent of the current path.

```js
/// file: src/routes/+page.server.js
export function load({ cookies }) {
	const visited = cookies.get('visited');

	+++cookies.set('visited', 'true', { path: '/' });+++

	return {
		visited
	};
}
```

Now, if you reload the iframe, `Hello stranger!` becomes `Hello friend!`.

Calling `cookies.set(name, ...)` causes a `Set-Cookie` header to be written, but it _also_ updates the internal map of cookies, meaning any subsequent calls to `cookies.get(name)` during the same request will return the updated value. Under the hood, the `cookies` API uses the popular `cookie` package — the options passed to `cookies.get` and `cookies.set` correspond to the `parse` and `serialize` options from the `cookie` [documentation](https://github.com/jshttp/cookie#api). SvelteKit sets the following defaults to make your cookies more secure:

```js
/// no-file
{
	httpOnly: true,
	secure: true,
	sameSite: 'lax'
}
```
