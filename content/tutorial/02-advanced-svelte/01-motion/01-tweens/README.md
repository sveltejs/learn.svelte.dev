---
title: Interpolation
---

Maintenant que nous avons couvert les bases, il est temps d'apprendre quelques techniques avancées de Svelte, en commençant par la gestion du _mouvement_.

Mettre à jour des valeurs et regarder le <span class="vo">[DOM](PUBLIC_SVELTE_SITE_URL/docs/web#dom)</span> s'actualiser automatiquement, c'est plutôt stylé. Vous savez ce qui est encore plus stylé ? _Interpoler_ (<span class="vo">[tween](PUBLIC_SVELTE_SITE_URL/docs/svelte-motion#tweened)</span>) entre ces valeurs. Svelte contient des outils pour vous aider à construire des interfaces utilisateur qui utilisent des animations pour mettre en valeur ce qui change.

Commençons par changer le <span class="vo">[store](PUBLIC_SVELTE_SITE_URL/docs/sveltejs#store)</span> `progress` en un store de type `tweened` :

```svelte
/// file: App.svelte
<script>
	import { +++tweened+++ } from 'svelte/+++motion+++';

	const progress = +++tweened+++(0);
</script>
```

Cliquer sur les boutons va animer la barre de progression vers sa nouvelle valeur. Mais c'est encore un peu robotique et pas vraiment satisfaisant. Nous pouvons ajouter à l'animation une fonction de lissage :

```svelte
/// file: App.svelte
<script>
	import { tweened } from 'svelte/motion';
	+++import { cubicOut } from 'svelte/easing';+++

	const progress = tweened(0, +++{
		duration: 400,
		easing: cubicOut
	}+++);
</script>
```

> Le module `svelte/easing` contient les [équations de lissage de Penner](https://web.archive.org/web/20190805215728/http://robertpenner.com/easing/), mais vous pouvez aussi créer votre propre fonction `p => t` où `p` et `t` sont toutes les deux des valeurs entre 0 et 1.

Voici la liste complète des options disponibles pour `tweened` :

* `delay` — durée en millisecondes avant le début de l'animation
* `duration` — soit la durée de l'animation en millisecondes, soit une fonction `(from, to) => milliseconds` vous permettant (par ex.) de créer des animations plus longues dans le cas de changements de valeurs plus larges
* `easing` — une fonction de lissage `p => t`
* `interpolate` — une fonction personnalisée `(from, to) => t => value` pour interpoler entre des valeurs arbitraires. Par défaut, Svelte interpole entre des nombres, des dates, et des tableaux ou objets de même forme (tant qu'ils contiennent uniquement des nombres et des dates ou d'autres tableaux ou objets valides). Si vous souhaitez interpoler (par ex.) entre des codes de couleurs ou des matrices de transformation, vous pouvez fournir un interpolateur personnalisé

Vous pouvez aussi passer ces options à `progress.set` et `progress.update` en tant que deuxième argument, auquel cas elles remplaceront les options par défaut. Les méthodes `set` et `update` retournent toutes les deux une promesse qui se résout quand l'animation se termine.
