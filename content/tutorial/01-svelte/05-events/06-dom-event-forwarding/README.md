---
title: Relais d'évènements DOM
---

Le relais d'évènement fonctionne également pour les évènements <span class="vo">[DOM](SITE_SVELTE/docs/web#dom)</span>.

Nous voulons être notifiés des clics sur notre `<CustomButton>` — pour cela, nous avons simplement besoin de relayer les évènements `click` sur l'élément `<button>` dans `CustomButton.svelte` :

```svelte
/// file: BigRedButton.svelte
<button +++on:click+++>
	Cliquez moi
</button>
```
