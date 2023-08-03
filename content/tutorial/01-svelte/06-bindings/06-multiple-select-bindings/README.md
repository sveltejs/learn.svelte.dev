---
title: Select multiple
---

Un élément `<select>` peut avoir un attribute `multiple`. Dans ce cas, la liaison va remplir un tableau plutôt que sélectionner une valeur unique.

Remplaces les checkbox par un select `<select multiple>`:

```svelte
/// file: App.svelte
<h2>Parfums</h2>

+++<select multiple bind:value={flavours}>+++
	{#each ['Cookie crémeux', 'Éclats de menthe', 'Vague à la fraise'] as flavour}
+++		<option>{flavour}</option>+++
	{/each}
+++</select>+++
```

Notez que nous pouvons omettre l'attribut `value` des `<option>`, puisque les valeurs sont identiques au contenu des éléments.

> Laisser enfoncée la touche `control` (ou la touche `command` sur MacOS) pour sélectionner plusieurs options.
