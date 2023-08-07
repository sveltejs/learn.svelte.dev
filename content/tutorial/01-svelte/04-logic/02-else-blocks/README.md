---
title: Blocs else
---

Comme en JavaScript, un bloc `if` peut être suivi d'un bloc `else` :

```svelte
/// file: App.svelte
{#if count > 10}
	<p>{count} est supérieur à 10</p>
+++{:else}
	<p>{count} est compris entre 0 et 10</p>+++
{/if}
```

> Un caractère `#` indique toujours une baliste d'_ouverture de bloc_. Un caractère `/` indique toujours une balise de _fermeture de bloc_. Un caractère `:`, comme dans `{:else}`, indique une balise de _continuité de bloc_. Ne vous en faites pas — vous avez déjà appris presque toute la syntaxe que Svelte ajoute au HTML.
