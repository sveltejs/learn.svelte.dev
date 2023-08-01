---
title: Transitions globales
---

En règle générale, les transitions ne s'appliquent aux éléments que lorsque le bloc qui les contient directement est ajouté ou détruit. Dans l'exemple présenté ici, le fait de changer la visibilité de la liste entière n'applique pas les transitions aux éléments individuels de la liste.

Au lieu de cela, nous aimerions que les transitions soient jouées non seulement lorsque des éléments individuels sont ajoutés et supprimés à l'aide du curseur, mais aussi lorsque nous basculons la case à cocher.

Nous pouvons y parvenir avec une transition _globale_, qui se déclenche lorsque _n'importe quel_ bloc contenant les transitions est ajouté ou supprimé :

```svelte
/// file: App.svelte
<div transition:slide+++|global+++>
	{item}
</div>
```

> Dans Svelte 3, les transitions étaient globales par défaut et il fallait utiliser le modificateur `|local` pour les rendre locales.
