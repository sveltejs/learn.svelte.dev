---
title: <svelte:self>
---

Svelte fournit un certain nombre d'éléments prêts à l'usage. Le premier, `<svelte:self>`, permet à un composant de se contenir lui-même récursivement.

C'est pratique pour des cas comme cette vue d'arborescence de dossiers, où les dossiers peuvent contenir d'_autres_ dossiers. Dans `Folder.svelte`, nous voulons pouvoir écrire ceci...

```svelte
/// file: Folder.svelte
{#if file.files}
	<Folder {...file}/>
{:else}
	<File {...file}/>
{/if}
```

...mais cela est impossible, car un module ne peut pas s'importer lui-même. À la place, nous utilisons `<svelte:self>` :

```svelte
/// file: Folder.svelte
{#if file.files}
	+++<svelte:self {...file}/>+++
{:else}
	<File {...file}/>
{/if}
```
