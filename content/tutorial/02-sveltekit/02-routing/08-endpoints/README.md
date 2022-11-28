---
title: Endpoints
---

So far, we have loaded data directly related to a page. Besides that, SvelteKit also provides you a way to retrieve and manipulate data through endpoints.

An endpoint is created by putting a `+server.js` in a directory. `src/routes/api/user/+server.js` becomes an endpoint accessible at `api/user`. The endpoint can provide methods corresponding to the http verbs you already may know from previous experience: `GET`, `PUT`, `POST`, `PATCH` and `DELETE`.

Create a simple endpoint at `api/user/+server.js` with a `GET` method from which you return a JSON response using the standard `Response` object:

```js
// api/user/+server.js
export function GET() {
	return new Response(JSON.stringify({ name: 'John Doe' }), {
		headers: { 'content-type': 'application/json' }
	});
}
```

Since returning JSON is probably what you want most of the time, SvelteKit provides you with a helper function to save you some boilerplate:

```js
// api/user/+server.js
+++import { json } from '@sveltejs/kit';+++

export function GET() {
	---return new Response(JSON.stringify({ name: 'John Doe' }), {
		headers: { 'content-type': 'application/json' }
	});---
    +++return json({ name: 'John Doe' });+++
}
```
