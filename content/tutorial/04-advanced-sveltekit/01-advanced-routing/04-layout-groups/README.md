---
title: Layout groups
---

Layouts form a hierarchy. A page inherits all layouts above it. Sometimes it's necessary to create a layout hierarchy that doesn't strictly follow the page hierarchy. For this, we can use layout groups.

In this example we have three pages — the home page, the about page, and a pricing page. The home and pricing page should both have a marketing layout, the about page should not. All three pages are at the same level, so we can't just put a common layout for the home and pricing page in the route hierarchy. To achieve this, we add a group.

A group is denoted by its surrounding parantheses. A group is ignored when creating the url: `(marketing)/price/+page.svelte` means that the URL to access this page is `/price`.

Create a `(marketing)` folder inside `routes` and move the home and pricing page inside (implementation hint: it's easiest if you use the rename feature). Last, create a new `+layout.svelte` inside `(marketing)`:

```diff
src/routes/
+├ (marketing)
│ ├ pricing/
│ │ └ +page.svelte
+│ ├ +layout.svelte
+│ └ +page.svelte
├ about/
│ └ +page.svelte
├ +layout.svelte
-└ +page.svelte
```

```svelte
/// file: src/routes/(marketing)/+layout.svelte
<div>Marketing Layout</div>

<slot />
```
