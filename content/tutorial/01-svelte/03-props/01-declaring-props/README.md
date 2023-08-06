---
title: Déclarer des props
---

Jusqu'à maintenant, nous avons exclusivement travaillé avec l'état interne d'un composant, c'est-à-dire des valeurs qui sont uniquement accessibles à l'intérieur du composant.

Dans n'importe quelle application réelle, vous aurez besoin de passer des données depuis un composant parent vers ses enfants. Pour cela, nous devons déclarer des _propriétés_, généralement appelées "<span class='vo'>props</span>". En Svelte, nous les déclarons avec le mot clé `export`. Éditez le composant `Nested.svelte` :

```svelte
/// file: Nested.svelte
<script>
	+++export+++ let answer;
</script>
```

> Comme `$:`, cela peut paraître étrange de prime abord. Ce n'est pas le fonctionnement habituel de `export` dans les modules JavaScript ! Faites avec pour l'instant — cela deviendra bientôt une seconde nature !
