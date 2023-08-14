---
title: Éléments media
---

Vous pouvez créer des liaisons avec les propriétés des éléments `<audio>` et `<video>`, facilitant la création (par exemple) d'interfaces de lecteur media personnalisées, comme `AudioPlayer.svelte`.

Tout d'abord, ajoutez l'élément `<audio>` avec ses liaisons (nous utiliserons ici la forme raccourcie pour `src`, `duration` et `paused`) :

```svelte
/// file: AudioPlayer.svelte
<div class="player" class:paused>
+++	<audio
		{src}
		bind:currentTime={time}
		bind:duration
		bind:paused
	/>+++

	<button
		class="play"
		aria-label={paused ? 'lecture' : 'pause'}
	/>
```

Ensuite, ajoutez un gestionnaire d'évènement au `<button>` qui active `paused` :

```svelte
/// file: AudioPlayer.svelte
<button
	class="play"
	aria-label={paused ? 'lecture' : 'pause'}
	+++on:click={() => paused = !paused}+++
/>
```

Notre lecteur audio est maintenant capable de fonctionner.
Ajoutons-lui la possibilité de rechercher une partie spécifique d'un morceau en déplaçant le curseur. Dans le gestionnaire de `pointerdown` du curseur, il y a une fonction `seek`, où nous pouvons mettre à jour `time` :

```js
/// file: AudioPlayer.svelte
function seek(e) {
	const { left, width } = div.getBoundingClientRect();

	let p = (e.clientX - left) / width;
	if (p < 0) p = 0;
	if (p > 1) p = 1;

	+++time = p * duration;+++
}
```

Lorsque le morceau se termine, soyez sympa — rembobinez :

```svelte
/// file: AudioPlayer.svelte
<audio
	{src}
	bind:currentTime={time}
	bind:duration
	bind:paused
+++	on:ended={() => {
		time = 0;
	}}+++
/>
```

La liste complète de liaisons possibles pour les éléments `<audio>` et `<video>` est la suivante — six liaisons _en lecture seule_...

* `duration` (lecture seule) — durée totale de la vidéo, en secondes
* `buffered` (lecture seule) — un tableau d'objets `{start, end}`
* `seekable` (lecture seule) — idem
* `played` (lecture seule) — idem
* `seeking` (lecture seule) — booléen
* `ended` (lecture seule) — booléen

...et cinq liaisons _bilatérales_ :

* `currentTime` — position actuelle de la vidéo, en secondes
* `playbackRate` — vitesse de lecture de la vidéo, où `1` est "normal"
* `paused` — celle-ci parle pour elle-même
* `volume` — valeur entre 0 et 1
* `muted` — valeur booléenne où `true` est "sourdine"

Les vidéos ont en plus les liaisons en lecture seule `videoWidth` et `videoHeight`.
