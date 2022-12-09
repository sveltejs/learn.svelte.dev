---
title: Private static environment variables
---

Like a good friend, SvelteKit keeps your secrets. When writing your backend and frontend in the same repository, it can be easy to accidentally import sensitive data into your front-end code (environment variables containing API keys, for example). SvelteKit helps you avoiding that through private environment variables.

Environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` (a NodeJS global). You can then access them through `import.meta.env.X` where `X` is the name of your environment variable. Vite already helps us by only exposing environment variables that start with `VITE_` (that prefix is configurable), others are considered private. It has two drawbacks though:

- There's no way to distinguish between variables we want to expose on the server and on the client. It's easy to accidentally expose sensitive data to your front-end code
- It's not type safe

SvelteKit solves both these drawbacks through its `$env/*` exports. Let's replace the environment variable in `src/routes/+page.server.js` using an import with the same name from `$env/static/private`:

```js
+++import { VITE_SECRET } from '$env/static/private';+++
import { db } from './db.js';

export function load() {
    return db.getData(---import.meta.env.---VITE_SECRET);
}
```

You are allowed to import private environment variables inside files ending with `.server.js` and files inside the `src/lib/server` folder. If you import that same variable in client code ...

```svelte
/// file: src/routes/+page.svelte
<script>
    +++import { VITE_SECRET } from '$env/static/private';+++
    export let data;
</script>

<p>{data.text}</p>
```

... you get an error. (Don't worry about the text still showing up in the background, this is a dev environment limitation - your prod build would fail.)

> Don't commit your `.env` file to Git if it contains sensitive information such as API keys!
