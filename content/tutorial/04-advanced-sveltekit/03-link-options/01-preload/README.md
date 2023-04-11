---
title: Preloading
---

In this exercise, the `/slow-a` and `/slow-b` routes both have artificial delays in their `load` functions, meaning it takes a long time to navigate to them.

You can't always make your data load more quickly — sometimes it's out of your control — but SvelteKit can speed up navigations by _anticipating_ them. When an `<a>` element has a `data-sveltekit-preload-data` attribute, SvelteKit will begin the navigation as soon as the user hovers over the link (on desktop) or taps it (on mobile). Try adding it to the first link:

```svelte
/// file: src/routes/+layout.svelte
<nav>
	<a href="/">home</a>
	<a href="/slow-a" +++data-sveltekit-preload-data+++>slow-a</a>
	<a href="/slow-b">slow-b</a>
</nav>
```

Navigating to `/slow-a` will now be noticeably faster. Starting navigation on hover or tap (rather than waiting for a `click` event to be registered) might not sound like it makes much difference, but in practice it typically saves 200ms or more. That's enough to be the difference between sluggish and snappy.

You can put the attribute on individual links, or on any element that _contains_ links. The default project template includes the attribute on the `<body>` element:

```html
/// no-file
<body data-sveltekit-preload-data>
	%sveltekit.body%
</body>
```

You can customise the behaviour further by specifying one of the following values for the attribute:

- `"hover"` (default, falls back to `"tap"` on mobile)
- `"tap"` — only begin preloading on tap
- `"off"` — disable preloading

Using `data-sveltekit-preload-data` may sometimes result in false positives - i.e. loading data in anticipation of a navigation that doesn't then happen — which might be undesirable. As an alternative, `data-sveltekit-preload-code` allows you to preload the JavaScript needed by a given route without eagerly loading its data. This attribute can have the following values:

- `"eager"` — preload everything on the page following a navigation
- `"viewport"` — preload everything as it appears in the viewport
- `"hover"` (default) as above
- `"tap"` — as above
- `"off"` — as above

You can also initiate preloading programmatically with `preloadCode` and `preloadData` imported from `$app/navigation`:

```js
/// no-file
import { preloadCode, preloadData } from '$app/navigation';

// preload the code and data needed to navigate to /foo
preloadData('/foo');

// preload the code needed to navigate to /bar, but not the data
preloadCode('/bar');
```