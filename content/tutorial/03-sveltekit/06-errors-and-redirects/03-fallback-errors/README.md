---
title: Fallback errors
---

If things go _really_ wrong — an error occurs while loading the root layout data, or while rendering the error page — SvelteKit will fall back to a static error page.

Add a new `src/routes/+layout.server.js` file to see this in action:

```js
/// file: src/routes/+layout.server.js
export function load() {
	throw new Error('yikes');
}
```

You can customise the fallback error page. Create a `src/error.html` file:

```html
/// file: src/error.html
<h1>Game over</h1>
<p>Code %sveltekit.status%</p>
<p>%sveltekit.error.message%</p>
```

This file can include the following:

- `%sveltekit.status%` — the HTTP status code
- `%sveltekit.error.message%` — the error message
