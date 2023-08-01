---
title: Slots
---

Tout comme les éléments peuvent avoir des enfants...

```html
/// no-file
<div>
	<p>I'm a child of the div</p>
</div>
```

...les instances de composants aussi. Toutefois, avant qu'il puisse accepter des enfants, l'instance a besoin de savoir où les positionner. Nous pouvons faire cela avec l'élément `<slot>`. Faites ceci dans `Card.svelte` :

```svelte
/// file: Card.svelte
<div class="card">
	+++<slot />+++
</div>
```

Vous pouvez maintenant mettre des choses dans la carte :

```svelte
/// file: App.svelte
<Card>
	+++<span>Patrick BATEMAN</span>+++
	+++<span>Vice President</span>+++
</Card>
```
