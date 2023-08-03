---
title: Évènements DOM
---

Nous avons déjà rapidement évoqué qu'il était possible d'écouter n'importe quel évènement du <span class="vo">[DOM](SITE_SVELTE/docs/web#dom)</span> sur un élément (tel que `click` ou encore [`pointermove``](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event)) avec la directive `on:` :

```svelte
/// file: App.svelte
<div +++on:pointermove={handleMove}+++>
	Le curseur se trouve à la position ({m.x} ; {m.y})
</div>
```
