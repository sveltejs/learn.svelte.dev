---
title: <svelte:element>
---

De même, nous ne savons pas toujours à l'avance quel type d'élément du <span class="vo">[DOM](SVELTE_SITE_URL/docs/web#dom)</span> afficher. `<svelte:element>` sert dans ces situations.
Comme dans l'[exercice précédent](svelte-component), nous pouvons remplacer une longue séquence de blocs `if` avec un seul élément dynamique :

```svelte
/// file: App.svelte
<select bind:value={selected}>
	{#each options as option}
		<option value={option}>{option}</option>
	{/each}
</select>

+++<svelte:element this={selected}>
	I'm a <code>&lt;{selected}&gt;</code> element
</svelte:element>+++
```

La valeur `this` peut être n'importe quelle chaîne de caractères, ou une valeur <span class="vo">[falsy](SVELTE_SITE_URL/docs/javascript#falsy-truthy-falsy)</span> — si la valeur est <span class="vo">[falsy](SVELTE_SITE_URL/docs/javascript#falsy-truthy-falsy)</span>, aucun composant n'est rendu.
