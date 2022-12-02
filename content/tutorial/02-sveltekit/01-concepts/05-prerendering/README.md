---
title: Prerendering
---

Prerendering means computing the contents of a page at build time and saving the HTML. You can opt in to prerendering for a single page, the entire app, or anything in between.

This approach has the same benefits as traditional server-rendered pages, but avoids recomputing the page for each visitor and so scales nearly for free as the number of visitors increases. The tradeoff is that the build process takes longer, and prerendered content can only be updated by building and deploying a new version of the application.

Not all pages can be prerendered. The basic rule is this: for content to be prerenderable, any two users hitting it directly must get the same content from the server, and the page must not contain actions. Note that you can still prerender content that is loaded based on the page's parameters as long as all users will be seeing the same prerendered content.

You can add user-specific data to a prerendered page by fetching it from the browser instead of using SvelteKit's built-in data loading, though this is generally not recommended since it will cause content to pop in as it loads.
