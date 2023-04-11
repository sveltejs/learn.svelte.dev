---
title: $env/static/public
---

Some environment variables _can_ be safely exposed to the browser. These are distinguished from private environment variables with a `PUBLIC_` prefix.

Add values to the two public environment variables in `.env`:

```env
/// file: .env
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
