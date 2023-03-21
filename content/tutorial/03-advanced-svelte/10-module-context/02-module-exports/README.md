---
title: Exports
---

Anything exported from a `context="module"` script block becomes an export from the module itself. If we export a `stopAll` function from `AudioPlayer.svelte`...

```svelte
/// file: AudioPlayer.svelte
<script context="module">
	const elements = new Set();

+++	export function stopAll() {
		elements.forEach(element => {
			element.pause();
		});
	}+++
</script>
```

...we can then import it from `App.svelte`...

```svelte
/// file: App.svelte
<script>
	import AudioPlayer, +++{ stopAll }+++ from './AudioPlayer.svelte';
</script>
```

...and use it in an event handler:

```svelte
/// file: App.svelte
<button +++on:click={stopAll}+++>
	stop all audio
</button>
```

> You can't have a default export, because the component _is_ the default export.
