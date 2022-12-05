---
title: API routes
---

As well as pages, we can create _API routes_ by adding a `+server.js` file that exports functions corresponding to HTTP methods: `GET`, `PUT`, `POST`, `PATCH` and `DELETE`.

This app fetches data from a `/roll` API route when you click the button. Create that route by adding a `src/routes/roll/+server.js` file:

```js
/// file: src/routes/roll/+server.js
/** @type {import('./$types').RequestHandler} */
export function GET() {
	const number = Math.ceil(Math.random() * 6);

	return new Response(number, {
		'Content-Type': 'application/json'
	});
}
```

Clicking the button now works.

Request handlers must return a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response) object. Since it's common to return JSON from an API route, SvelteKit provides a convenience function for generating these responses, complete with the appropriate `Content-Type` header:

```js
/// file: src/routes/roll/+server.js
+++import { json } from '@sveltejs/kit';+++

/** @type {import('./$types').RequestHandler} */
export function GET() {
	const number = Math.ceil(Math.random() * 6);

---	return new Response(number, {
		'Content-Type': 'application/json'
	});---
+++	return json(number);+++
}
```
