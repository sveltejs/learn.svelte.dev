---
title: Ressorts
---

La fonction `spring` ("ressort" en français) est une alternative à `tweened` qui fonctionne en général mieux pour des valeurs qui changent souvent.

Dans cet exemple, nous avons deux <span class="vo">[stores](SVELTE_SITE_URL/docs/sveltejs#store)</span> — le premier représente les coordonnées du cercle, le deuxième représente sa taille. Transformons-les en ressorts :

```svelte
/// file: App.svelte
<script>
	import { +++spring+++ } from 'svelte/+++motion+++';

	let coords = +++spring+++({ x: 50, y: 50 });
	let size = +++spring+++(10);
</script>
```

Les deux ressorts ont des valeurs de raideur (`stiffness`) et d'amortissement (`damping`), qui contrôlent le caractère "élastique" du ressort. Nous pouvons préciser nos propres valeurs initiales :

```js
/// file: App.svelte
let coords = spring({ x: 50, y: 50 }, +++{
	stiffness: 0.1,
	damping: 0.25
}+++);
```

Faites bouger votre souris, et essayez de changer les curseurs pour avoir une idée de comment chaque paramètre affecte le comportement du ressort. Notez que vous pouvez ajuster les valeurs pendant que le ressort est encore en mouvement.

