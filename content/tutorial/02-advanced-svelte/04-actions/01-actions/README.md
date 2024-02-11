---
title: La directive use
---

Les actions sont des fonctions de cycle de vie pour les éléments du <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span>. Elles sont utiles dans différents cas, par exemple :

- s'interfacer avec des librairies tierces
- gérer le chargement retardé (<span class="vo">[lazy loading](PUBLIC_SVELTE_SITE_URL/docs/web#lazy-loading)</span>) des images
- créer des info-bulles (<span class="vo">[tooltip](PUBLIC_SVELTE_SITE_URL/docs/development#tooltip)</span>)
- ajouter des gestionnaires d'évènements personnalisés

Dans cette application, vous pouvez gribouiller sur le `<canvas>`, et changer les couleurs et la taille du pinceau via le menu. Mais si vous ouvrez le menu et faites défiler les options avec la touche Tab, vous vous apercevrez rapidement que le focus _n'est pas conservé_ à l'intérieur de la modale.

Nous pouvons y remédier avec une action. Importer `trapFocus` de `actions.js` :

```svelte
/// file: App.svelte
<script>
	import Canvas from './Canvas.svelte';
	+++import { trapFocus } from './actions.js';+++

	const colors = ["rouge", "orange", "jaune", "vert", "bleu", "indigo", "violet", "blanc", "noir"].;
	let selected = colors[0];
	let size = 10;

	let showMenu = true;
</script>
```

...puis ajoutez-là au menu avec la directive `use:` :

```svelte
/// file: App.svelte
<div class="menu" +++use:trapFocus+++>
```

Jetons un coup d'oeil à la fonction `trapFocus` dans `actions.js`. Une fonction d'action est appelée avec un noeud `node` - le `<div class="menu">` dans notre cas - lorsque le noeud est monté dans le <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span>, et peut retourner un objet d'action avec une méthode `destroy`.

Tout d'abord, nous devons ajouter un récepteur d'événements qui intercepte les pressions sur les touches de tabulation :

```js
/// file: actions.js
focusable()[0]?.focus();

+++node.addEventListener('keydown', handleKeydown);+++
```

Enfin, nous devons faire un peu de nettoyage lorsque le nœud est démonté - en supprimant l'écouteur d'événement et en rétablissant le focus à l'endroit où il se trouvait avant que l'élément ne soit monté :

```js
/// file: actions.js
focusable()[0]?.focus();

node.addEventListener('keydown', handleKeydown);

+++return {
	destroy() {
		node.removeEventListener('keydown', handleKeydown);
		previous?.focus();
	}
};+++
```

Désormais, lorsque vous ouvrez le menu, vous pouvez faire défiler les options à l'aide de la touche Tab.
