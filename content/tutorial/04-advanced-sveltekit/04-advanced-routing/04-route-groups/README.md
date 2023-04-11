---
title: Route groups
---

As we saw in the [routing introduction](/tutorial/layouts), layouts are a way to share UI and data loading logic between different routes.

Sometimes it's useful to use layouts without affecting the route — for example, you might need your `/app` and `/account` routes to be behind authentication, while your `/about` page is open to the world. We can do this with a _route group_, which is a directory in parentheses.

Create an `(authed)` group by renaming `account` to `(authed)/account` then renaming `app` to `(authed)/app`.

Now we can control access to these routes by creating `src/routes/(authed)/+layout.server.js`:

```js
/// file: src/routes/(authed)/+layout.server.js
import { redirect } from '@sveltejs/kit';

export function load({ cookies, url }) {
	if (!cookies.get('logged_in')) {
		throw redirect(303, `/login?redirectTo=${url.pathname}`);
	}
}
```

If you try to visit these pages, you'll be redirected to the `/login` route, which has a form action in `src/routes/login/+page.server.js` that sets the `logged_in` cookie.

We can also add some UI to these two routes by adding a `src/routes/(authed)/+layout.svelte` file:

```svelte
/// file: src/routes/(authed)/+layout.svelte
<form method="POST" action="/logout">
	<button>Log out</button>
</form>

<slot />
```
