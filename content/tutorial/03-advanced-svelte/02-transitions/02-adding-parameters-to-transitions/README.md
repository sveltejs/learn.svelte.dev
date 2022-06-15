---
title: Adding parameters
---

Transition functions can accept [parameters]($docs#template-syntax-element-directives-transition-fn-transition-parameters). Replace the [`fade`]($docs#run-time-svelte-transition-fade) transition with [`fly`]($docs#run-time-svelte-transition-fly)...

```svelte
<script>
	import { +++fly+++ } from 'svelte/transition';
	let visible = true;
</script>
```

...and apply it to the `<p>` along with some options:

```svelte
<p transition:+++fly={{ y: 200, duration: 2000 }}+++>
	+++Flies+++ in and out
</p>
```

Note that the transition is _reversible_ — if you toggle the checkbox while the transition is ongoing, it transitions from the current point, rather than the beginning or the end.
