---
title: Instructions
---

Nous ne sommes pas limité•e•s à la déclaration de **valeurs** réactives — nous pouvons aussi exécuter des **instructions** de manière réactive. Par exemple, nous pouvons afficher la valeur de `count` à chaque fois qu'elle change :

```js
/// file: App.svelte
let count = 0;

+++$: console.log(`le compteur vaut ${count}`);+++
```

Vous pouvez facilement grouper des instructions avec un bloc :

```js
/// file: App.svelte
$: +++{+++
	console.log('le compteur vaut ' + count);
	console.log(`ceci sera aussi affiché à chaque fois que count change`);
+++}+++
```

Vous pouvez même ajouter `$:` devant des blocs `if` par exemple :

```js
/// file: App.svelte
$: +++if (count >= 10)+++ {
	alert('le compteur est dangereusement élevé !');
	count = 0;
}
```
