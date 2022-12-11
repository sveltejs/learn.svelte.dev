---
title: Using both load functions
---

In rare cases, you might need to use both a `+page.server.js` and `+page.js` `load` function together — for example, you might need to return an instance of a custom class that was initialised with data from your server.

The data returned from the `+page.server.js` `load` function can be accessed through the `data` property passed to the `+page.js` function. Use it to append the strings and return the result:

```js
/// file: src/routes/+page.js
export async function load({ +++data+++ }) {
	return { greeting: +++data.greeting + +++' and the shared load function' };
}
```
