---
title: Blocs if
---

Le HTML n'est pas prévu pour exprimer de la _logique_, comme des conditions ou des boucles. Svelte si.

Pour afficher conditionnellement du <span class="vo">[markup](PUBLIC_SVELTE_SITE_URL/docs/web#markup)</span>, nous pouvons le placer dans un bloc `if`. Ajoutons du texte qui apparaîtra lorsque le compteur `count`sera supérieur à `10` :

```svelte
/// file: App.svelte
<button on:click={increment}>
	Il y a eu {count}
	{count === 1 ? 'clic' : 'clics'}
</button>

+++{#if count > 10}
	<p>{count} est supérieur à 10</p>
{/if}+++
```

Essayez — mettez à jour le composant, et cliquez sur les boutons.
