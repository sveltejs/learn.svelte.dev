---
title: Transitions CSS personnalisées
---

Le module `svelte/transition` a plusieurs transitions prêtes à l'emploi, mais il est très simple de créer la vôtre. Par exemple, voici le code source de la transition `fade` :

```js
/// no-file
function fade(node, { delay = 0, duration = 400 }) {
	const o = +getComputedStyle(node).opacity;

	return {
		delay,
		duration,
		css: (t) => `opacity: ${t * o}`
	};
}
```

La fonction prend deux arguments — le noeud auquel la transition est appliquée, et tout paramètre qu'on lui donne — et retourne un objet de transition qui peut avoir les propriétés suivantes :

* `delay` — durée en millisecondes avant le début de la transition
* `duration` — durée de la transition en millisecondes
* `easing` — une fonction de lissage `p => t` (voir le chapitre [Interpolation](/tutorial/tweened))
* `css` — une fonction `(t, u) => css`, où `u === 1 - t`
* `tick` — une fonction `(t, u) => {...}` qui a de l'effet sur le noeud

La valeur `t` vaut `0` au début d'une entrée ou à la fin d'une sortie, et `1` à la fin d'une entrée ou au début d'une sortie.

La plupart du temps vous devriez renvoyer la propriété `css` et **pas** la propriété `tick`, car les animations CSS sont exécutées sur un fil d'exécution (<span class="vo">[thread](SVELTE_SITE_URL/docs/development#thread)</span>
) différent pour éviter au maximum les ralentissements. Svelte "simule" la transition et construit une animation CSS, puis la lance.

Par exemple, la transition `fade` génère une animation CSS qui ressemble à ça :

```css
/// no-file
0% { opacity: 0 }
10% { opacity: 0.1 }
20% { opacity: 0.2 }
/* ... */
100% { opacity: 1 }
```

Mais nous pouvons déborder d'imagination. Faisons quelque chose de complètement gratuit :

```svelte
/// file: App.svelte
<script>
	import { fade } from 'svelte/transition';
	+++import { elasticOut } from 'svelte/easing';+++

	let visible = true;

	function spin(node, { duration }) {
		return {
			duration,
			css: t => +++{
				const eased = elasticOut(t);

				return `
					transform: scale(${eased}) rotate(${eased * 1080}deg);
					color: hsl(
						${Math.trunc(t * 360)},
						${Math.min(100, 1000 * (1 - t))}%,
						${Math.min(50, 500 * (1 - t))}%
					);`
			}+++
		};
	}
</script>
```

Souvenez-vous : un grand pouvoir amène de grandes responsabilités.
