---
title: Breaking out of layouts
---

Layouts form a strict hierarchy. Every page inherits the layout above it, which itself inherits the layout above it and so on. Sometimes it's useful to break out of that hierarchy.

Let's rewind the layout inside `business/pricing/+page.svelte` to the root `+layout.svelte`. To do that, we add an `@` sign behind `+page.svelte`:

```diff
src/routes/
├ business
│ ├ pricing/
│ │ └ +layout@.svelte
+│ │ └ +page@.svelte
-│ │ └ +page.svelte
│ ├ +layout.svelte
│ └ +page.svelte
├ +layout.svelte
└ +page.svelte
```

In general we can reset to one of the upper layouts by appending `@` followed by the segment name. In this example, we could also rewind to `business/+layout.svelte` by writing `+page@business.svelte`

> The root layout applies to every page of your app, you cannot break out of it.
