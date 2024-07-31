---
title: Streaming data
path: /blog/welcome
---

Ordinarily, SvelteKit will load all the data your page needs _before_ rendering it. In general this provides a better user experience than showing loading spinners and skeleton UI everywhere. But sometimes you know that some data will be slow to load, and that it would be better to render the rest of the page instead of waiting for it. In these cases, we can return promises from `load` functions.

In this exercise, we've added comments to the blog from [earlier](page-data), via a `getComments` function in `src/lib/server/data.js` with a simulated delay.

Update `src/routes/blog/[slug]/+page.server.js` to load the comments:

```js
/// file: src/routes/blog/[slug]/+page.server.js
import { error } from '@sveltejs/kit';
import * as db from '$lib/server/data.js';

export function load({ params }) {
	const post = db.getPost(params.slug);
	
	if (!post) throw error(404);

	return {
		post,
+++		promises: {
			comments: db.getComments(params.slug)
		}+++
	};
}
```

> If `comments` is a top-level property of the returned object, SvelteKit will automatically await it. For that reason, we must nest it inside an object. Here, we've called that object `promises`, but the name is not important.

Inside `src/routes/blog/[slug]/+page.svelte` we can now use an [`{#await ...}`](await-blocks) block to render placeholder UI while the data loads:

```svelte
/// file: src/routes/blog/[slug]/+page.svelte
<script>
	export let data;
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>

+++<h2>Comments</h2>

{#await data.promises.comments}
	<p>loading comments...</p>
{:then comments}
	{#each comments as comment}
		<p><strong>{comment.author}</strong> {comment.content}</p>
	{/each}
{:catch}
	<p>failed to load comments</p>
{/await}+++
```