---
title: Private dynamic environment variables
---

Some environment variables aren't statically known at build time - for example they could be injected through the deployment platform at runtime. SvelteKit has you covered for these situations with a similar tuple of exports.

To access dynamic environment variables, replace the `$env/static/private` import with `$env/dynamic/private` and use the `env` variable instead, since we can't know the name statically:

```js
/// file: src/routes/+page.server.js
import { ---VITE_SECRET---+++env+++ } from '$env/---static---+++dynamic+++/private';
import { db } from './db.js';

export function load() {
    return db.getData(+++env.+++VITE_SECRET);
}
```

Just like with private static variables you would get an error when importing it in public code. You will also get auto-completion on the `env` object if you added this variable to your local `.env` file.

> In dev, `$env/dynamic` always includes environment variables from `.env`. In prod, this behavior will depend on your adapter.

> Don't commit your `.env` file to Git if it contains sensitive information such as API keys!
