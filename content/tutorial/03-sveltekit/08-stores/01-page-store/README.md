---
title: page
---

As we learned [earlier](writable-stores), Svelte stores are a place to put data that doesn't belong to an individual component.

SvelteKit makes three readonly stores available via the `$app/stores` module — `page`, `navigating` and `updating`. The one you'll use most often is [`page`](https://kit.svelte.dev/docs/types#public-types-page), which provides information about the current page:

* `url` — the [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) of the current page
* `params` — the current page's [parameters](params)
* `route` — an object with an `id` property representing the current route
* `status` — the HTTP status code of the current page
* `error` — the error object of the current page, if any (you'll learn more about error handling in [later](error-basics) [exercises](handleerror))
* `data` — the data for the current page, combining the return values of all `load` functions
* `form` — the data returned from a [form action](the-form-element)

As with any other store, you can reference its value in a component by prefixing its name with the `$` symbol. For example, we can access the current pathname as `$page.url.pathname`:

```svelte
/// file: src/routes/+layout.svelte
+++<script>
	import { page } from '$app/stores';
</script>+++

<nav>
	<a href="/" +++aria-current={$page.url.pathname === '/'}+++>
		home
	</a>

	<a href="/about" +++aria-current={$page.url.pathname === '/about'}+++>
		about
	</a>
</nav>

<slot />
```