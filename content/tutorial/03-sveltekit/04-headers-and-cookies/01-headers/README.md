---
title: Setting headers
---

Inside a `load` function (as well as in [form actions](the-form-element), [hooks](handle) and [API routes](get-handlers), which we'll learn about later) you have access to a `setHeaders` function, which — unsurprisingly — can be used to set headers on the response.

Most commonly, you'd use it to customise caching behaviour with the [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) response header, but for the sake of this tutorial we'll do something less advisable and more dramatic:

```js
/// file: src/routes/+page.server.js
export function load(+++{ setHeaders }+++) {
+++	setHeaders({
		'Content-Type': 'text/plain'
	});+++
}
```

(You may need to reload the iframe to see the effect.)
