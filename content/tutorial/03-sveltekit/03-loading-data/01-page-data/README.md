---
title: Page data
path: /blog
---

At its core, SvelteKit's job boils down to three things:

1. **Routing** — figure out which route matches an incoming request
2. **Loading** — get the data needed by the route
3. **Rendering** - generate some HTML (on the server) or update the DOM (in the browser)

We've seen how routing and rendering work. Let's talk about the middle part — loading.

Every page of your app can declare a `load` function in a `+page.server.js` file alongside the `+page.svelte` file. As the file name suggests, this module only ever runs on the server, including for client-side navigations. Let's add a `src/routes/blog/+page.server.js` file so that we can replace the hard-coded links in `src/routes/blog/+page.svelte` with actual blog post data:

```js
/// file: src/routes/blog/+page.server.js
import { posts } from './data.js';

export function load() {
	return {
		summaries: posts.map((post) => ({
			slug: post.slug,
			title: post.title
		}))
	};
}
```

> For the sake of the tutorial, we're importing data from `src/routes/blog/data.js`. In a real app, you'd be more likely to load the data from a database or a CMS, but for now we'll do it like this.

We can access this data in `src/routes/blog/+page.svelte` via the `data` prop:

```svelte
/// file: src/routes/blog/+page.svelte
+++<script>
	export let data;
</script>+++

<h1>blog</h1>

<ul>
---	<li><a href="/blog/one">one</a></li>
	<li><a href="/blog/two">two</a></li>
	<li><a href="/blog/three">three</a></li>---
+++	{#each data.summaries as { slug, title }}
		<li><a href="/blog/{slug}">{title}</a></li>
	{/each}+++
</ul>
```

Now, let's do the same for the post page:

```js
/// file: src/routes/blog/[slug]/+page.server.js
import { posts } from '../data.js';

export function load({ params }) {
	const post = posts.find((post) => post.slug === params.slug);

	return {
		post
	};
}
```

```svelte
/// file: src/routes/blog/[slug]/+page.svelte
+++<script>
	export let data;
</script>+++

---<h1>blog post</h1>---
+++<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>+++
```

There's one last detail we need to take care of — the user might visit an invalid pathname like `/blog/nope`, in which case we'd like to respond with a 404 page:

```js
/// file: src/routes/blog/[slug]/+page.server.js
+++import { error } from '@sveltejs/kit';+++
import { posts } from '../data.js';

export function load({ params }) {
	const post = posts.find((post) => post.slug === params.slug);

	+++if (!post) throw error(404);+++

	return {
		post
	};
}
```

We'll learn more about error handling in later chapters.
