---
title: Modificateurs d'évènement
---

Les gestionnaires d'évènements <span class="vo">[DOM](SITE_SVELTE/docs/web#dom)</span> peuvent utiliser des **modificateurs** qui changent leur comportement. Par exemple, un gestionnaire avec le modificateur `once` ne s'exécutera qu'une seule fois :

```svelte
/// file: App.svelte
<button on:click+++|once+++={() => alert('cliqué')}>
	Cliquez moi
</button>
```

La liste complète des modificateurs se trouve ici :

* `preventDefault` — appelle `event.preventDefault()` avant d'exécuter le gestionnaire. Utile, par exemple, pour la gestion de formulaire côté client.
* `stopPropagation` — appelle `event.stopPropagation()`, et empêche ainsi l'évènement d'atteindre le prochain élément
* `passive` — améliore la performance du défilement pour les évènements `touch`/`wheel` (Svelte l'ajoutera automatiquement aux endroits où ça ne pose pas de problème)
* `nonpassive` — déclare explicitement `passive: false`
* `capture` — déclenche le gestionnaire pendant la phase de <span class="vo">[capture](SITE_SVELTE/docs/javascript#bubble-capture)</span> plutôt que pendant la phase de <span class="vo">[bubbling](SITE_SVELTE/docs/javascript#bubble-capture)</span> ([MDN docs](https://developer.mozilla.org/fr/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture))
* `once` — supprime le gestionnaire après qu'il ait été exécuté la première fois
* `self` — déclenche le gestionnaire uniquement si `event.target` est l'élément lui-même
* `trusted` — déclenche le gestionnaire uniquement si `event.isTrusted` est `true`, c'est-à-dire si l'évènement est généré par une action de l'utilisateur

Vous pouvez cumuler les modificateurs, par ex. `on:click|once|capture={...}`.
