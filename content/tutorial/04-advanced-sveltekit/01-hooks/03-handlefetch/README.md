---
title: handleFetch
---

The `event` object has a `fetch` method that behaves like the standard [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), but with superpowers:

- it can be used to make credentialed requests on the server, as it inherits the `cookie` and `authorization` headers from the incoming request
- it can make relative requests on the server (ordinarily, `fetch` requires a URL with an origin when used in a server context)
- internal requests (e.g. for `+server.js` routes) go directly to the handler function when running on the server, without the overhead of an HTTP call

Its behaviour can be modified with the `handleFetch` hook, which by default looks like this:

```js
/// file: src/hooks.server.js
export async function handleFetch({ event, request, fetch }) {
	return await fetch(request);
}
```

For example, we could respond to requests for `src/routes/a/+server.js` with responses from `src/routes/b/+server.js` instead:

```js
/// file: src/hooks.server.js
export async function handleFetch({ event, request, fetch }) {
+++	const url = new URL(request.url);
	if (url.pathname === '/a') {
		return await fetch('/b');
	}+++

	return await fetch(request);
}
```

Later, when we cover [universal `load` functions](universal-load-functions), we'll see that `event.fetch` can also be called from the browser. In that scenario, `handleFetch` is useful if you have requests to a public URL like `https://api.yourapp.com` from the browser, that should be redirected to an internal URL (bypassing whatever proxies and load balancers sit between the API server and the public internet) when running on the server.