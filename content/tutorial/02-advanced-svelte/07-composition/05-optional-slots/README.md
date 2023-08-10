---
title: Vérifier le contenu des slots
---

Vous avez besoin de contrôler chaque partie de votre composant en fonction de si du contenu <span class="vo">[slotté](SVELTE_SITE_URL/docs/sveltejs#slot)</span> est fourni. Par exemple, si nous enlevons le `<header>` de `App.svelte`...

```svelte
/// file: App.svelte
---<header slot="header" class="row">
	<span class="color" />
	<span class="name">nome</span>
	<span class="hex">hex</span>
	<span class="rgb">rgb</span>
	<span class="hsl">hsl</span>
</header>---

<div class="row">
	<span class="color" style="background-color: {row.hex}" />
	<span class="name">{row.name}</span>
	<span class="hex">{row.hex}</span>
	<span class="rgb">{row.rgb}</span>
	<span class="hsl">{row.hsl}</span>
</div>
```

...nous nous retrouvons avec une double bordure affreuse parce que `FilterableList.svelte` continue d'afficher le `<div class="header">`.

Nous pouvons régler cela en utilisant la variable spéciale `$$slots` dans `FilterableList.svelte` :

```svelte
/// file: FilterableList.svelte
+++{#if $$slots.header}+++
	<div class="header">
		<slot name="header"/>
	</div>
+++{/if}+++
```
