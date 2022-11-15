---
title: Layout Groups
---

Sections of your app often share a common UI. To not repeat that code, we can use layouts. These form a hierarchy, a page inherits all layouts above it. Sometimes it's necessary to break out of this hierarchy. For this, we can use layout groups.

In this example we have three pages — the home page, the about page, and a pricing page. The home and pricing page should both have a marketing layout, the about page should not. All three pages are at the same level, so we can't put a common layout for the home and pricing page in the route hierarchy. Instead, we add a group.

A group is denoted by its surrounding parantheses. A group is ignored when creating the url: `(marketing)/price/+page.svelte` means that the URL to access this page is `/price`.

TODO how to do a before/after when we don't have a way to create files? Should we have one?
