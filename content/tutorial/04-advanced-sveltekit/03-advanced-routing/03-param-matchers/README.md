---
title: Param matchers
path: /colors/ff3e00
---

To prevent the router from matching on invalid input, you can specify a _matcher_. For example, you might want a route like `/colors/[value]` to match hex values like `/colors/ff3e00` but not named colors like `/colors/octarine` or any other arbitrary input.

First, create a new file called `src/params/hex.js` and export a `match` function from it:

```js
/// file: src/params/hex.js
export function match(value) {
	return /^[0-9a-f]{6}$/.test(value);
}
```

Then, to use the new matcher, rename `src/routes/colors/[color]` to `src/routes/colors/[color=hex]`.

Now, whenever someone navigates to that route, SvelteKit will verify that `color` is a valid `hex` value. If not, SvelteKit will try to match other routes, before eventually returning a 404.

> Matchers run both on the server and in the browser.
