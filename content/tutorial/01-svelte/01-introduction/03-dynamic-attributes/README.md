---
title: Attributs dynamiques
---

Vous pouvez utiliser des accolades pour contrôler les attributs d'un élément, comme vous le feriez pour contrôler du texte.

Il manque l'attribut `src` à notre image — corrigeons cet oubli :

```svelte
/// file: App.svelte
<img +++src={src}+++ />
```

Voilà qui est mieux. Mais Svelte nous avertit :

> A11y: &lt;img&gt; element should have an alt attribute

Lorsque l'on construit des applications web, il est important de s'assurer que celles-ci sont **accessibles** à l'audience la plus large possible, en incluant des personnes avec (par exemple) des déficiences visuelles ou moteures, ou des personnes avec du matériel informatique peu puissant, ou avec une mauvaise connection internet. L'accessibilité (que l'on écrit souvent "a11y") n'est pas toujours simple à mettre en place correctement, mais Svelte vous aidera en vous avertissant si vos écrivez du <span class="vo">[markup](PUBLIC_SVELTE_SITE_URL/docs/web#markup)</span> non accessible.

Dans ce cas, il manque à notre image l'attribut `alt` qui décrit l'image pour les personnes utilisant des liseuses d'écran, ou pour les personnes ne pouvant pas télécharger l'image en raison d'une mauvaise connection internet. Rectifions cela :

```svelte
/// file: App.svelte
<img src={src} +++alt="Un homme danse">
```

Nous pouvons utiliser des accolades **à l'intérieur** des attributs. Essayez de changer l'attribut `alt` en `"{name} danse."` — n'oubliez pas de déclarer une variable `name` dans le bloc `<script>`.

## Raccourcis d'attributs

Il est courant d'avoir un attribut ayant le même nom que la variable qu'on lui fournit, comme `src={src}`. Dans ce cas, Svelte nous donne accès à un raccourci pratique :

```svelte
/// file: App.svelte
<img +++{src}+++ alt="{name} danse." />
```
