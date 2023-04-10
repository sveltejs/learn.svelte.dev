---
title: The RequestEvent object
---

The `event` object passed into `handle` is the same object — an instance of a [`RequestEvent`](https://kit.svelte.dev/docs/types#public-types-requestevent) — that is passed into [API routes](get-handlers) in `+server.js` files, [form actions](the-form-element) in `+page.server.js` files, and `load` functions in `+page.server.js` and `+layout.server.js`.

It contains a number of useful properties and methods, some of which we've already encountered:

* `cookies` — the [cookies API](cookies)
* `fetch` — the standard [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), with additional powers
* `getClientAddress()` — a function to get the client's IP address
* `isDataRequest` — `true` if the browser is requesting data for a page during client-side navigation, `false` if a page/route is being requested directly
* `locals` — a place to put arbitrary data
* `params` — the route parameters
* `request` — the [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object
* `route` — an object with an `id` property representing the route that was matched
* `setHeaders(...)` — a function for [setting HTTP headers](headers) on the response
* `url` — a [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object representing the current request

A useful pattern is to add some data to `event.locals` in `handle` so that it can be read in subsequent `load` functions:

```js
/// file: src/hooks.server.js
export async function handle({ event, resolve }) {
	+++event.locals.answer = 42;+++
	return await resolve(event);
}
```

```js
/// file: src/routes/+page.server.js
export function load(+++event+++) {
	return {
		message: `the answer is ${+++event.locals.answer+++}`
	};
}
```

