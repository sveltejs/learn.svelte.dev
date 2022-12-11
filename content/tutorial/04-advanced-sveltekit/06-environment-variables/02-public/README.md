---
title: Public environment variables
---

Some environment variables _can_ be safely exposed to the browser. These are distinguished from private environment variables with a `PUBLIC_` prefix.

Add values to the two public environment variables in `.env`:

```env
PUBLIC_THEME_BACKGROUND=+++"steelblue"+++
PUBLIC_THEME_FOREGROUND=+++"bisque"+++
```

Then, import them into `src/routes/+page.svelte`:

```svelte
/// file: src/routes/+page.svelte
<script>
---	const PUBLIC_THEME_BACKGROUND = 'white';
	const PUBLIC_THEME_FOREGROUND = 'black';---
+++	import {
		PUBLIC_THEME_BACKGROUND,
		PUBLIC_THEME_FOREGROUND
	} from '$env/static/public';+++
</script>
```

As with private environment variables, it's preferable to use static values if possible, but if necessary we can use dynamic values instead:

```svelte
<script>
	import { +++env+++ } from '$env/+++dynamic+++/public';
</script>

<main
	style:background={+++env.+++PUBLIC_THEME_BACKGROUND}
	style:color={+++env.+++PUBLIC_THEME_FOREGROUND}
>
	<span>{+++env.+++PUBLIC_THEME_FOREGROUND} on {+++env.+++PUBLIC_THEME_BACKGROUND}</span>
</main>
```
