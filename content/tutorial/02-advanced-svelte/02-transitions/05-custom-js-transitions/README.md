---
title: Transitions JS personnalisées
---

Même si vous devriez en général utiliser les transitions CSS autant que possible, il y a certains effets qui ne peuvent pas être réalisés sans JavaScript, comme l'effet machine à écrire :

```js
/// file: App.svelte
function typewriter(node, { speed = 1 }) {
	const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

	if (!valid) {
		throw new Error(`Cette transition ne fonctionne que sur les éléments qui n'ont qu'un seul noeud enfant de type texte`);
	}

	+++const text = node.textContent;
	const duration = text.length / (speed * 0.01);

	return {
		duration,
		tick: (t) => {
			const i = Math.trunc(text.length * t);
			node.textContent = text.slice(0, i);
		}
	};+++
}
```
