---
title: Exports
---

Tout ce qui est exporté par un bloc `<script context="module">` devient un export du module. Exportons une fonction `stopAll` depuis `AudioPlayer.svelte` :

```svelte
/// file: AudioPlayer.svelte
<script context="module">
	let current;

+++	export function stopAll() {
		current?.pause();
	}+++
</script>
```

Nous pouvons alors importer `stopAll` dans `App.svelte`...

```svelte
/// file: App.svelte
<script>
	import AudioPlayer, +++{ stopAll }+++ from './AudioPlayer.svelte';
	import { tracks } from './tracks.js';
</script>
```

...et nous en servir dans un gestionnaire d'évènements :

```svelte
/// file: App.svelte
<div class="centered">
	{#each tracks as track}
		<AudioPlayer {...track} />
	{/each}

+++	<button on:click={stopAll}>
		tout arrêter
	</button>+++
</div>
```

> Vous ne pouvez pas définir d'export par défaut, car le composant _est_ l'export par défaut.
