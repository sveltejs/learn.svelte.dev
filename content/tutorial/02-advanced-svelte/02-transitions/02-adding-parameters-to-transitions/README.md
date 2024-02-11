---
title: Ajout de paramètres
---

Les fonctions de transition acceptent des arguments. Remplacez la transition `fade` par `fly`...

```svelte
/// file: App.svelte
<script>
	import { +++fly+++ } from 'svelte/transition';
	let visible = true;
</script>
```

... et appliquez-là au `<p>` avec quelques options :

```svelte
/// file: App.svelte
<p transition:+++fly={{ y: 200, duration: 2000 }}+++>
	+++Flies+++ in and out
</p>
```

Notez que la transition est _réversible_ — si vous cliquez sur la <span class="vo">[checkbox](PUBLIC_SVELTE_SITE_URL/docs/web#checkbox)</span> pendant que la transition est en cours, l'élément transitionne dans l'autre sens à partir de son état courant, plutôt que de reprendre au début ou à la fin.
