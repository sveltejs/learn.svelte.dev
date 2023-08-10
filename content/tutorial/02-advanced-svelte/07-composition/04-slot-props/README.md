---
title: Slot props
---

Les composants peuvent _retourner_ de la donnée au contenu <span class="vo">[slotté](SVELTE_SITE_URL/docs/sveltejs#slot)</span> via des _propriétés de slot_, ou _slot props_. Dans cette application, nous avons une liste de noms de couleurs CSS. Il est possible de les filtrer avec l'`<input>`.

Pour le moment, chaque ligne affiche `AliceBlue`, et même si la couleur est superbe, ce n'est pas ce que nous recherchons.

Ouvrez `FilterableList.svelte`. Le `<slot>` est rendu pour chaque élément de la liste. Passez la donnée dans le <span class="vo">[slot](SVELTE_SITE_URL/docs/sveltejs#slot)</span> :

```svelte
/// file: FilterableList.svelte
<div class="content">
	{#each data.filter(matches) as item}
		<slot +++{item}+++ />
	{/each}
</div>
```

(Comme dans d'autres cas, `{item}` est le raccourci de `item={item}`.)

Puis, de l'autre côté, exposez la donnée au contenu <span class="vo">[slotté](SVELTE_SITE_URL/docs/sveltejs#slot)</span> en utilisant la directive `let:` :

```svelte
/// file: App.svelte
<FilterableList
	data={colors}
	field="name"
	+++let:item={row}+++
>
	<div class="row">
		<span class="color" style="background-color: {row.hex}" />
		<span class="name">{row.name}</span>
		<span class="hex">{row.hex}</span>
		<span class="rgb">{row.rgb}</span>
		<span class="hsl">{row.hsl}</span>
	</div>
</FilterableList>
```

Enfin, débarrassez-vous de la variable de base, dont nous n'avons plus besoin :

```svelte
/// file: App.svelte
<script>
	import FilterableList from './FilterableList.svelte';
	import { colors } from './colors.js';

	---let row = colors[0];---
</script>
```

> Les <span class="vo">[slots](SVELTE_SITE_URL/docs/sveltejs#slot)</span> nommés peut aussi avoir des <span class="vo">[props](SVELTE_SITE_URL/docs/sveltejs#props)</span>; utilisez la directive `let` sur un élément avec un attribut `slot=...` à la place du composant lui-même.
