---
title: Liaisons <svelte:window>
---

Nous pouvons également créer des liaisons avec certaines propriétés de `window`, comme `scrollY` :

```svelte
/// file: App.svelte
<svelte:window +++bind:scrollY={y}+++ />
```

La liste des propriétés compatibles avec les liaisons est la suivante :

- `innerWidth`
- `innerHeight`
- `outerWidth`
- `outerHeight`
- `scrollX`
- `scrollY`
- `online` — an alias for `window.navigator.onLine`

Toutes sauf `scrollX` et `scrollY` sont en lecture seule.
