---
title: tick
---

La fonction `tick` est différente des autres fonctions de cycle de vie : vous pouvez l'appeler à n'importe quel moment, et pas uniquement lorsque le composant est instancié. Cette fonction retourne une promesse qui se résout dès que tous les changements d'état ont été appliqués au <span class="vo">[DOM](SVELTE_SITE_URL/docs/web#dom)</span> (ou immédiatement, si aucun changement d'état n'est en attente).

Lorsque vous mettez à jour l'état d'un composant en Svelte, au lieu de mettre le <span class="vo">[DOM](SVELTE_SITE_URL/docs/web#dom)</span> à jour immédiatement, Svelte va attendre la prochaine _microtâche_ pour vérifier s'il n'y a pas d'autres changements à appliquer, même dans d'autres composants. Cela permet d'éviter du travail inutile en permettant au navigateur de regrouper plus efficacement les modifications.

Vous pouvez constater ce comportement dans cet exemple. Sélectionner un morceau de texte et appuyez sur la touche Tab. Comme la valeur du `<textarea>` change, la sélection courante est effacée et le curseur se décale à la fin, ce qui est pénible. Nous pouvons résoudre cela en important `tick`...

```js
/// file: App.svelte
+++import { tick } from 'svelte';+++

let text = `Sélectionnez du texte et appuyez sur Tab pour mettre en majuscules`;
```

...et en l'exécutant immédiatement avant de mettre à jour `this.selectionStart` et `this.selectionEnd` à la fin de `handleKeydown` :

```js
/// file: App.svelte
+++await tick();+++
this.selectionStart = selectionStart;
this.selectionEnd = selectionEnd;
```
