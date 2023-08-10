---
title: Styles de composant
---

Il est souvent nécessaire d'influencer le style à l'intérieur d'un composant enfant. Vous pourriez vouloir afficher ces boîtes en rouge, vert et bleu.

Une façon d'y parvenir est d'utiliser le modificateur CSS `:global`, qui vous permet de cibler n'importe quels éléments dans d'autre composants :

```svelte
/// file: App.svelte
<style>
	.boxes :global(.box:nth-child(1)) {
		background-color: red;
	}

	.boxes :global(.box:nth-child(2)) {
		background-color: green;
	}

	.boxes :global(.box:nth-child(3)) {
		background-color: blue;
	}
</style>
```

Mais il y a beaucoup de raisons qui incitent à ne _pas_ faire cela. D'une part, c'est très verbeux. D'autre part, c'est fragile — tout changement d'implémentation de `Bos.svelte` pourrait casser le sélecteur.

Mais surtout, c'est malpoli. Les composants devraient être capables de décider par eux-même quels styles peuvent être contrôlés par l'extérieur, de la même façon qu'ils décident quelles variables sont exposées en tant que <span class="vo">[props](SVELTE_SITE_URL/docs/sveltejs#props)</span>. `:global` devrait être uniquement utilisé comme bouée de sauvetage — en dernier recours.

Dans `Box.svelte`, modifiez `background-color` pour qu'elle soit déterminée par une [propriété CSS personnalisée](https://developer.mozilla.org/fr/docs/Web/CSS/--*) :

```svelte
/// file: Box.svelte
<style>
	.box {
		width: 5em;
		height: 5em;
		border-radius: 0.5em;
		margin: 0 0 1em 0;
		background-color: +++var(--color, #ddd)+++;
	}
</style>
```

Tout élément parent (comme `<div class="boxes">`) peut changer la valeur de `--color`, mais nous pouvons aussi la changer sur des composants individuels :

```svelte
/// file: App.svelte
<div class="boxes">
	<Box +++--color="red"+++ />
	<Box +++--color="green"+++ />
	<Box +++--color="blue"+++ />
</div>
```

Les valeurs peuvent être dynamiques, comme n'importe quel attribut.

Cette fonctionnalité fonctionne en entourant chaque composant d'une `<div style="display: contents">`, lorsque nécessaire, et en y appliquant les propriétés personnalisées.
