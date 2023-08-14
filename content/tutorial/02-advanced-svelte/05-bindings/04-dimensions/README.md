---
title: Dimensions
---

Chaque élément de type bloc (`display: block`) a des liaisons `clientWidth`, `clientHeight`, `offsetWidth` et `offsetHeight` possibles :

```svelte
/// file: App.svelte
<div +++bind:clientWidth={w} bind:clientHeight={h}+++>
	<span style="font-size: {size}px" contenteditable>{text}</span>
	<span class="size">{w} x {h}px</span>
</div>
```

Ces liaisons sont en lecture seule — changer les valeurs de `w` et `h` n'aura pas d'effet sur l'élément.

> Les éléments sont mesurés en utilisant une technique proche de [celle-ci](http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/). Elle implique un certain surcoût, il n'est donc pas recommandé de se servir de ces liaisons sur un grand nombre d'éléments.
>
> Les éléments `display: inline` ne peuvent pas être mesurés avec cette approche ; les éléments qui ne peuvent pas contenir d'autres éléments non plus (`<canvas>` par exemple). Dans ces cas-là, vous devrez mesurer les dimensions d'un élément contenant à la place.
