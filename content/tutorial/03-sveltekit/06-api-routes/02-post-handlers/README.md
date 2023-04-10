---
title: POST handlers
---

You can also add handlers that mutate data, such as `POST`. In most cases, you should use [form actions](the-form-element) instead — you'll end up writing less code, and it'll work without JavaScript, making it more resilient.

Inside the `keydown` event handler of the 'add a todo' `<input>`, let's post some data to the server:

```svelte
/// file: src/routes/+page.svelte
<input
	type="text"
	autocomplete="off"
	on:keydown={async (e) => {
		if (e.key === 'Enter') {
			const input = e.currentTarget;
			const description = input.value;

+++			const response = await fetch('/todo', {
				method: 'POST',
				body: JSON.stringify({ description }),
				headers: {
					'Content-Type': 'application/json'
				}
			});+++

			input.value = '';
		}
	}}
/>
```

Here, we're posting some JSON to the `/todo` API route — using a `userid` from the user's cookies — and receiving the `id` of the newly created todo in response.

Create the `/todo` route by adding a `src/routes/todo/+server.js` file with a `POST` handler that calls `createTodo` in `src/lib/server/database.js`:

```js
/// file: src/routes/todo/+server.js
import { json } from '@sveltejs/kit';
import * as database from '$lib/server/database.js';

export async function POST({ request, cookies }) {
	const { description } = await request.json();

	const userid = cookies.get('userid');
	const { id } = await database.createTodo({ userid, description });

	return json({ id }, { status: 201 });
}
```

As with `load` functions and form actions, the `request` is a standard [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object; `await request.json()` returns the data that we posted from the event handler.

We're returning a response with a [201 Created](https://httpstatusdogs.com/201-created) status and the `id` of the newly generated todo in our database. Back in the event handler, we can use this to update the page:

```svelte
/// file: src/routes/+page.svelte
<input
	type="text"
	autocomplete="off"
	on:keydown={async (e) => {
		if (e.key === 'Enter') {
			const input = e.currentTarget;
			const description = input.value;

			const response = await fetch('/todo', {
				method: 'POST',
				body: JSON.stringify({ description }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

+++			const { id } = await response.json();

			data.todos = [...data.todos, {
				id,
				description
			}];+++

			input.value = '';
		}
	}}
/>
```

> You should only mutate `data` in such a way that you'd get the same result by reloading the page.
