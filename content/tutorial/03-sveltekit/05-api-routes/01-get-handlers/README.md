---
title: GET handlers
---

SvelteKit allows you to create more than just pages. We can also create _API routes_ by adding a `+server.js` file that exports functions corresponding to HTTP methods: `GET`, `PUT`, `POST`, `PATCH` and `DELETE`.

This app fetches data from a `/roll` API route when you click the button. Create that route by adding a `src/routes/roll/+server.js` file:

```js
/// file: src/routes/roll/+server.js
export function GET() {
	const number = Math.floor(Math.random() * 6) + 1;

	return new Response(number, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
```

Clicking the button now works.

Request handlers must return a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response) object. Since it's common to return JSON from an API route, SvelteKit provides a convenience function for generating these responses:

```js
/// file: src/routes/roll/+server.js
+++import { json } from '@sveltejs/kit';+++

export function GET() {
	const number = Math.floor(Math.random() * 6) + 1;

---	return new Response(number, {
		headers: {
			'Content-Type': 'application/json'
		}
	});---
+++	return json(number);+++
}
```
