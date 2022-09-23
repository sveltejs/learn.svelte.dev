---
title: What is SvelteKit?
---

> WARNING: this content is a work in progress and is not up to date with breaking changes in the latest version of SvelteKit. For the latest information, refer to the [SvelteKit docs](https://kit.svelte.dev/docs).

So far, we've been working on individual components, or groups of components, in isolation. But to build a complete app, you need more than just components.

That's where SvelteKit comes in. Whereas Svelte is a _component framework_, SvelteKit is an _app framework_ (or 'metaframework', depending on who you ask) that solves the tricky problems of building something production-ready:

- Routing
- Server-side rendering
- Data fetching
- Service workers
- TypeScript integration
- Prerendering
- Single-page apps
- Library packaging
- Optimised production builds
- Deploying to different hosting providers
- ...and so on

It also provides a world-class development experience powered by [Vite](https://vitejs.dev). SvelteKit apps are server-rendered by default (like traditional 'multi-page apps' or MPAs) for excellent first load performance and SEO characteristics, but can then transition to client-side navigation (like modern 'single-page apps' or SPAs) to avoid jankily reloading everything (including things like third-party analytics code) when the user navigates. They can run anywhere JavaScript runs, though — as we'll see — your users may not need to run any JavaScript at all.

If that sounds complicated, worry not: you've been using SvelteKit this whole time!
