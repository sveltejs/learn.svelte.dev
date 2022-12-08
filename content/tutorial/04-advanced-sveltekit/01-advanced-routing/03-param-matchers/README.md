---
title: Param matchers
---

A route like `src/routes/archive/[page]` would match `/archive/3`, but it would also match `/archive/potato`. We don't want that. You can ensure that route parameters are well-formed by adding a matcher — which takes the parameter string (`"3"` or `"potato"`) and returns `true` if it is valid.

First add a `params` directory (all matchers go in there) with a matcher in it:

```diff
src/
+├ params/
+│ └ integer.js
├ routes/
│ ├ archive/
│ │ ├ [page]/
│ │ │ └ +page.svelte
│ ├ +layout.svelte
│ └ +page.svelte
```

```js
/// file: src/params/integer.js
export function match(param) {
	return /^\d+$/.test(param);
}
```

Then augment your routes with the matcher:

```diff
src/
├ params/
│ └ integer.js
├ routes/
│ ├ archive/
-│ │ ├ [page]/
+│ │ ├ [page=integer]/
│ │ │ └ +page.svelte
│ ├ +layout.svelte
│ └ +page.svelte
```

Now, whenever someone navigates to that page, the validator will try to match the `[page]` parameter to see if it's valid. If the pathname doesn't match, SvelteKit will try to match other routes, before eventually returning a 404.

> Matchers run both on the server and in the browser.
