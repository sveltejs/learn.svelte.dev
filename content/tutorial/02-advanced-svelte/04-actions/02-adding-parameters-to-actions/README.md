---
title: Ajouter des paramètres
---

À l'instar des transitions et des animations, une action peut prendre un argument de paramètres ; la fonction d'action sera alors appelée avec deux arguments : l'élément sur lequel cette fonction est appliquée (comme vu précédemment), et l'argument de paramètres.

Dans cet exercice, nous voulons ajouter une infobulle au `<button>` en utilisant la bibliothèque [`Tippy.js`] (https://atomiks.github.io/tippyjs/). L'action est déjà liée avec `use:tooltip`, mais si vous survolez le bouton (ou si vous le sélectionnez avec le clavier), l'infobulle n'a pas de contenu.

Tout d'abord, l'action doit accepter certaines options et les transmettre à Tippy :

```js
/// file: App.svelte
function tooltip(node, +++options+++) {
	const tooltip = tippy(node, +++options+++);

	return {
		destroy() {
			tooltip.destroy();
		}
	};
}
```

Ensuite, nous devons passer quelques options dans l'action :

```svelte
/// file: App.svelte
<button use:tooltip+++={{ content, theme: 'material' }}+++>
	Survolez-moi
</button>
```

La bulle d'aide fonctionne maintenant — presque. Si nous changeons le texte dans l'élément `<input>`, l'infobulle ne sera pas mis à jour avec le nouveau contenu. Nous pouvons corriger ça en ajoutant une méthode `update` à l'objet retourné :

```js
/// file: App.svelte
function tooltip(node, options) {
	const tooltip = tippy(node, options);

	return {
+++		update(options) {
			tooltip.setProps(options);
		},+++
		destroy() {
			tooltip.destroy();
		}
	};
}
```
