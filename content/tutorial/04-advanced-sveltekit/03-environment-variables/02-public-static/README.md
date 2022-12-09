---
title: Public static environment variables
---

In the previous section we saw how to leverage `$env/static/private` for secret environment variables which can't be exposed to front-end code. But what to do if we _do_ want to expose such an environment variable, because it's public?

For this, first prefix the environment variable inside `.env` with `PUBLIC_`. This prefix (which is [configurable](https://kit.svelte.dev/docs/configuration#env)) marks an environment variable as eligible for use in front-end code.

```js
+++PUBLIC_+++KEY="It's ok to see this"
```

Then switch the import in `src/routes/+page.svelte` from `$env/static/private` to `$env/static/public` and prefix the variable with `PUBLIC_` aswell:

```svelte
<script>
    import { +++PUBLIC_+++KEY } from '$env/static/---private---+++public+++';
</script>

<p>
	My public environment variable is:
	{+++PUBLIC_+++KEY}
</p>
```

The `PUBLIC_` prefix on the imported variable might seem redundant at first - but that's actually a good thing! You immediately see that this is a public environment variable without looking up where it's imported from, and search-and-replace across the code base get's easier.

> Don't commit your `.env` file to Git if it contains sensitive information such as API keys!
