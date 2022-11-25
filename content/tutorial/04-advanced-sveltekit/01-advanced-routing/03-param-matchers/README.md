---
title: Param Matchers
---

A route like `src/routes/archive/[page]` would match `/archive/3`, but it would also match `/archive/potato`. We don't want that. You can ensure that route parameters are well-formed by adding a matcher — which takes the parameter string (`"3"` or `"potato"`) and returns `true` if it is valid.

First add a matcher to your `params` directory:

```diff
src/
├ params/
+│ └ integer.js
├ routes/
│ ├ archive/
│ │ ├ [page]/
│ │ │ └ +page.svelte
│ ├ +layout.svelte
│ └ +page.svelte
```

```js
// src/params/integer.js
+++export function match(param) {
	return /^\d+$/.test(param);
}+++
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

If the pathname doesn't match, SvelteKit will try to match other routes (using the sort order specified below), before eventually returning a 404.

> Matchers run both on the server and in the browser.
