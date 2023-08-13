---
title: Mise à jour de tableaux et d'objets
---

Parce que la réactivité de Svelte est uniquement déclenchée par les assignations, utiliser des méthodes sur les tableaux tels que `push` ou `splice` ne déclenchera pas de mise à jour automatiquement.

Par exemple, cliquer sur le bouton "Ajouter un nombre" ne fait rien pour l'instant, même si nous appelons `numbers.push(...)` à l'intérieur de `addNumber`.

Une façon d'y remédier est d'ajouter une affectation qui serait autrement redondante :

```js
/// file: App.svelte
function addNumber() {
	numbers.push(numbers.length + 1);
	+++numbers = numbers;+++
}
```

Mais il existe une solution plus simple :

```js
/// file: App.svelte
function addNumber() {
	numbers = +++[...numbers, numbers.length + 1];+++
}
```

La même règle s'applique aux méthodes de tableaux telles que `pop`, `shift`, et `splice`, ainsi qu'aux méthodes d'objets comme `Map.set`, `Set.add`, etc.

Les assignations aux _propriétés_ de tableaux ou d'objets, — par ex. `obj.foo += 1` ou `array[i] = x` — fonctionnent de la même façon que des assignations à des variables.

```js
/// file: App.svelte
function addNumber() {
	numbers[numbers.length] = numbers.length + 1;
}
```

Une règle simple : le nom de la variable mise à jour doit apparaître dans la partie gauche de l'affectation. Par exemple, ceci...

```js
/// no-file
const foo = obj.foo;
foo.bar = 'baz';
```

...ne déclenchera pas de réactivité sur `obj.foo.bar`, à moins que vous ne le fassiez suivre de `obj = obj`.
