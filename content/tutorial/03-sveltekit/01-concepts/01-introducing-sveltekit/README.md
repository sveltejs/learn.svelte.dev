---
title: What is SvelteKit?
---

Whereas Svelte is a _component framework_, SvelteKit is an _app framework_ (or 'metaframework', depending on who you ask) that solves the tricky problems of building something production-ready:

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

If that sounds complicated, worry not: SvelteKit is the framework that grows with you! Start simple and add new features as you need them.

## Project structure

On the right, in the file tree viewer, you'll see a handful of files that SvelteKit expects to find in a project.

`package.json` will be familiar if you've worked with Node.js before. It lists the project's dependencies — including `svelte` and `@sveltejs/kit` — and a variety of `scripts` for interacting with the SvelteKit CLI. (We're currently running `npm run dev` in the bottom window.)

> Note that it also specifies `"type": "module"`, which means that `.js` files are treated as native JavaScript modules by default, rather than the legacy CommonJS format.

`svelte.config.js` contains your project configuration. We don't need to worry about this file for now, but if you're curious, [visit the documentation](https://kit.svelte.dev/docs/configuration).

`src` is where your app's source code goes. `src/app.html` is your page template (SvelteKit replaces the `%sveltekit.head%` and `%sveltekit.body%` as appropriate), and `src/routes` defines the [routes](/tutorial/pages) of your app.

Finally, `static` contains any assets (like a `favicon.png` or a `robots.txt`) that should be included when your app is deployed.