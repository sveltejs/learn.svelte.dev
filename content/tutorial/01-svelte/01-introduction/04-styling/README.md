---
title: Style
---

Comme en HTML, vous pouvez ajouter une balise `<style>` à votre composant. Donnons un peu de style à notre élément `<p>` :

```svelte
/// file: App.svelte
<p>Ceci est un paragraphe.</p>

<style>
+++	p {
		color: goldenrod;
		font-family: 'Comic Sans MS', cursive;
		font-size: 2em;
	}+++
</style>
```

Il est important de comprendre que ces règles CSS sont **restreintes (ou <span class='vo'>[scopées](SITE_SVELTE/docs/development#scope)</span>) au composant**. Vous ne modifierez pas accidentellement le style des éléments `<p>` du reste de votre application, comme nous le verrons dans l'étape suivante.