---
title: Universal load functions
---

> Coming soon

In the meantime, read the [documentation](https://kit.svelte.dev/docs/load#shared-vs-server) to learn more about the distinction between server `load` functions and universal `load` functions.

<!--
In the previous two exercises we loaded data from the server using `+page.server.js` and `+layout.server.js` files. This is very convenient if you need to do things like getting data directly from a database, or reading cookies.

Sometimes it doesn't make sense to load data from the server when doing a client-side navigation. For example:

- You're loading data from an external API
- You want to use in-memory data if it's available
- You want to delay navigation until an image has been preloaded, to avoid pop-in
- You need to return something from `load` that can't be serialized (SvelteKit uses [devalue](https://github.com/Rich-Harris/devalue) to turn server data into JSON), such as a component or a store

In this example, we're loading data from an external API in `src/routes/+page.server.js` and `src/routes/item/[id]/+page.server.js`. That means that every time we navigate from one page to another, we're making a request to our server, which in turn makes a request to the API. That's an unnecessary detour that slows requests down and increases load on our server.

Let's cut out the middleman: rename both `+page.server.js` files to `+page.js`.

Now, the `load` functions will run on the server during server-side rendering, but will run in the browser for subsequent client-side navigations. The trade-off is that we no longer have access to things that need a server (databases, cookies, private environment variables and so on), but in this case we don't need those things. Read the [documentation](https://kit.svelte.dev/docs/load#shared-vs-server) to learn more about the distinction between server `load` functions and universal `load` functions.
-->
