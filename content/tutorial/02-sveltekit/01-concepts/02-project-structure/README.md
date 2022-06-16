---
title: Project structure
---

On the right, in the file tree viewer, you'll see a handful of files that SvelteKit expects to find in a project.

`package.json` will be familiar if you've worked with Node.js before. It lists the project's dependencies — including `svelte` and `@sveltejs/kit` — and a variety of `scripts` for interacting with the SvelteKit CLI. (We're currently running `npm run dev` in the bottom window.)

> Note that it also specifies `"type": "module"`, which means that `.js` files are treated as native JavaScript modules by default, rather than the legacy CommonJS format.

`svelte.config.js` contains your project configuration. We don't need to worry about this file for now, but if you're curious, [visit the documentation](https://kit.svelte.dev/docs/configuration).

`src` is where your app's source code goes. `src/app.html` is your page template (SvelteKit replaces the `%sveltekit.head%` and `%sveltekit.body%` as appropriate), and `src/routes` defines the [routes](/tutorial/pages) of your app.

Finally, `static` contains any assets (like a `favicon.png` or a `robots.txt`) that should be included when your app is deployed.
