---
title: Inputs groupés
---

Si vous avez plusieurs `<input>` dédiés à la même valeur, vous pouvez utiliser `bind:group` en plus de l'attribut `value`. Les `<input type=radio>` d'un même groupe sont mutuellement exclusifs ; les `<input type=checkbox>` d'un même groupe créent un tableau des valeurs sélectionnées.

Ajoutez `bind:group={scoops}` à l'`<input>` <span class="vo">[radio](PUBLIC_SVELTE_SITE_URL/docs/web#checkbox)</span> :

```svelte
/// file: App.svelte
<input
	type="radio"
	name="scoops"
	value={number}
	+++bind:group={scoops}+++
/>
```

...et `bind:group={flavours}` aux `<input>` <span class='vo'>[checkbox](PUBLIC_SVELTE_SITE_URL/docs/web#checkbox)</span> :

```svelte
/// file: App.svelte
<input
	type="checkbox"
	name="flavours"
	value={flavour}
	+++bind:group={flavours}+++
/>
```
