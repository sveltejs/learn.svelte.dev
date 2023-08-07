---
title: Gestionnaires en ligne
---

Vous pouvez aussi déclarer les gestionnaires d'évènement en ligne :

```svelte
/// file: App.svelte
<script>
	let m = { x: 0, y: 0 };

	---function handleMove(event) {
		m.x = event.clientX;
		m.y = event.clientY;
	}---
</script>

<div
	on:pointermove={+++(e) => {
		m = { x: e.clientX, y: e.clientY };
	}+++}
>
	Le curseur se trouve à la position ({m.x} ; {m.y})
</div>
```

> Certains <span class='vo'>[frameworks](SVELTE_SITE_URL/docs/development#framework)</span> recommendent d'éviter les gestionnaires d'évènements en ligne pour des raisons de performance, particulièrement au sein de boucles. Ce conseil ne s'applique pas pour Svelte — le compilateur prendra toujours la bonne décision, peu importe la forme que vous choisissez.
