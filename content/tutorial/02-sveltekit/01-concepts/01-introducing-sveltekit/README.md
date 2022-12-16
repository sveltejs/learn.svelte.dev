---
title: What is SvelteKit?
---

SvelteKit is a framework for building extremely high-performance web apps. Whereas Svelte is a _component framework_, SvelteKit is an _app framework_ (or 'metaframework', depending on who you ask) that solves the tricky problems of building something production-ready:

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

SvelteKit apps are server-rendered by default (like traditional 'multi-page apps' or MPAs) for excellent first load performance and SEO characteristics, but can then transition to client-side navigation (like modern 'single-page apps' or SPAs) to avoid jankily reloading everything (including things like third-party analytics code) when the user navigates. They can run anywhere JavaScript runs, though — as we'll see — your users may not need to run any JavaScript at all.

If that sounds complicated, worry not: SvelteKit is the framework that grows with you! Start simple and add new features as they come. This tutorial will go over the core concepts, while the [Advanced SvelteKit](/tutorial/handle) tutorial teaches you how to tackle more complex use cases.
