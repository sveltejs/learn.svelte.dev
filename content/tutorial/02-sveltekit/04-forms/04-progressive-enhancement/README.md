---
title: Progressive enhancement
---

Because we're using `<form>`, our app works even if the user doesn't have JavaScript ([which happens more often than you probably think](https://kryogenix.org/code/browser/everyonehasjs.html)). That's great, because it means our app is resilient.

Most of the time, users _do_ have JavaScript. In those cases, we can _progressively enhance_ the experience, the same way SvelteKit progressively enhances `<a>` elements by using client-side routing.

Import the `enhance` function from `$app/forms`...

```svelte
/// file: src/routes/+page.svelte
<script>
	+++import { enhance } from '$app/forms';+++

	export let data;
	export let form;
</script>
```

...and add the `use:enhance` directive to the `<form>` elements:

```svelte
<form method="POST" action="?/create" +++use:enhance+++>
```

```svelte
<form method="POST" action="?/delete" +++use:enhance+++>
```

And that's all it takes! Now, when JavaScript is enabled, `use:enhance` will emulate the browser-native behaviour except for the full-page reloads. It will:

- update the `form` prop
- invalidate all data on a successful response, causing `load` functions to re-run
- navigate to the new page on a redirect response
- render the nearest error page if an error occurs

Now that we're updating the page rather than reloading it, we can get fancy with things like transitions:

```svelte
/// file: src/routes/+page.svelte
<script>
	+++import { fly, slide } from 'svelte/transition';+++
	import { enhance } from '$app/forms';

	export let data;
	export let form;
</script>
```

```svelte
<li class="todo" +++in:fly={{ y: 20 }} out:slide+++>...</li>
```
