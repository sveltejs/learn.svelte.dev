---
title: <svelte:window>
---

De même qu'il est possible d'ajouter des gestionnaires d'évènements à n'importe quel élément du <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span>, vous pouvez en ajouter à l'objet `window` avec `<svelte:window>`.

Nous avons déjà une fonction `handleKeydown` définie — il ne nous reste qu'à ajouter un gestionnaire `keydown` :

```svelte
/// file: App.svelte
<svelte:window +++on:keydown={handleKeydown}+++ />
```

> Comme pour les éléments du <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span>, vous pouvez ajouter des [modificateurs d'évènements](/tutorial/event-modifiers) comme `preventDefault`.
