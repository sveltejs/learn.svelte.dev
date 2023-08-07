---
title: Évènements de transition
---

Il peut être utilise de savoir quand les transitions commencent ou finissent. Svelte génère des évènements que vous pouvez écouter comme n'importe quel évènement <span class="vo">[DOM](SVELTE_SITE_URL/docs/web#dom)</span> :

```svelte
/// file: App.svelte
<p
	transition:fly={{ y: 200, duration: 2000 }}
	+++on:introstart={() => status = `début de l'entrée`}
	on:outrostart={() => status = 'début de la sortie'}
	on:introend={() => status = `fin de l'entrée`}
	on:outroend={() => status = 'fin de la sortie'}+++
>
	Entre et sort en volant
</p>
```
