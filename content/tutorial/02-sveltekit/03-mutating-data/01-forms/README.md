---
title: Forms
---

A fundamental part of a web app is not only loading data, but also manipulating and saving it back. The way to do this on the web is to use `<form>` elements.

Let's create a login form with email and password. First we write the HTML in `+page.svelte`:

```svelte
<p>Please log in</p>

+++<form method="POST">
	<label>
		Email
		<input type="email" name="email" />
	</label>
	<label>
		Password
		<input type="password" name="password" />
	</label>
	<button>Log In</button>
</form>+++
```

A couple of things to note

- this is plain old HTML, there's nothing SvelteKit-specific about this
- we use `method="POST"` which means when the form is submitted, it does a `POST` request to the page it's on, sending the form value in the body, which is much safer compared to `method="GET"` because the values would appear in the search query.

That's all we need for the HTML part. Let's handle that form action inside `+page.server.js`. For that, we export an `actions` object with the property `default` in it. This property is a function from which we will redirect to the user page - for now, without checking the credentials (we'll do that in the next section). We do this by importing `redirect` from `@sveltejs/kit` and `throw`ing it with a redirect status code and a destination.

```js
+++import { redirect } from '@sveltejs/kit';

export const actions = {
	default: () => {
		throw redirect(307, '/user');
	}
}+++
```
