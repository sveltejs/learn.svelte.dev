---
title: Exports
---

Anything exported from a `context="module"` script block becomes an export from the module itself. Let's export a `stopAll` function:

```svelte
/// file: AudioPlayer.svelte
<script context="module">
	let current;

+++	export function stopAll() {
		current?.pause();
	}+++
</script>
```

We can now import `stopAll` in `App.svelte`...

```svelte
/// file: App.svelte
<script>
	import AudioPlayer, +++{ stopAll }+++ from './AudioPlayer.svelte';
	import { tracks } from './tracks.js';
</script>
```

...and use it in an event handler:

```svelte
/// file: App.svelte
<div class="centered">
	{#each tracks as track}
		<AudioPlayer {...track} />
	{/each}

+++	<button on:click={stopAll}>
		stop all
	</button>+++
</div>
```

> You can't have a default export, because the component _is_ the default export.
