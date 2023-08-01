---
title: <svelte:body>
---

Comme pour `<svelte:window>`, l'élément `<svelte:bopy>` vous permet d'écouter les évènements qui se déclenchent sur `document.body`. C'est utile avec les évènements `mouseenter` et `mouseleave`, qui ne se déclenchent pas sur `window`.

Ajoutez les gestionnaires `mouseenter` et `mouseleave` à la balise `<svelte:body>`...

```svelte
/// file: App.svelte
<svelte:body
	+++on:mouseenter={() => hereKitty = true}+++
	+++on:mouseleave={() => hereKitty = false}+++
/>
```

...et survolez le `<body>`.
