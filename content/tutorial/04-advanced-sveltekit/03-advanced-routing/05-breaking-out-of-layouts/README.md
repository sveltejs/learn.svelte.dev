---
title: Breaking out of layouts
---

Ordinarily, a page inherits every layout above it, meaning that `src/routes/a/b/c/+page.svelte` inherits four layouts:

- `src/routes/+layout.svelte`
- `src/routes/a/+layout.svelte`
- `src/routes/a/b/+layout.svelte`
- `src/routes/a/b/c/+layout.svelte`

Occasionally, it's useful to break out of the current layout hierarchy. We can do that by adding the `@` sign followed by the name of the parent segment to 'reset' to — for example `+page@b.svelte` would put `/a/b/c` inside `src/routes/a/b/+layout.svelte`, while `+page@a.svelte` would put it inside `src/routes/a/+layout.svelte`.

Let's reset it all the way to the root layout, by renaming it to `+page@.svelte`.

> The root layout applies to every page of your app, you cannot break out of it.
