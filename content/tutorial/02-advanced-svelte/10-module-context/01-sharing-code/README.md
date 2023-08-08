---
title: Partager du code
---

Dans tous les exemples que nous avons vu jusque là, le bloc `<script>` contient du code qui est exécuté lorsque chaque instance de composant est initialisé. Pour la grande majorité des composants, vous n'avez pas besoin de plus.

Très rarement, vous aurez besoin d'exécuter du code en dehors d'une instance de composant individuelle. Par exemple : revenons à notre lecteur audio d'un [exercice précédent](media-elements). Vous pouvez lancer ces cinq lecteurs audio simultanément. Il serait plus pratique si la lecture de l'un arrêtait la lecture de tous les autres.

Nous pouvons faire cela en déclarant un bloc `<script context="module">`. Le code contenu à l'intérieur sera exécuté une seule fois, lorsque le module est évalué la première fois, plutôt que lorsqu'un composant est instancié. Ajoutez le code suivant en haut de `AudioPlayer.svelte` (notez qu'il s'agit d'une balise `<script>` _différente_) :

```svelte
/// file: AudioPlayer.svelte
+++<script context="module">
	let current;
</script>+++
```

Nos instances de composant peuvent maintenant se "parler" sans aucune gestion d'état :

```svelte
/// file: AudioPlayer.svelte
<audio
	src={src}
	bind:currentTime={time}
	bind:duration
	bind:paused
+++	on:play={(e) => {
		const audio = e.currentTarget;

		if (audio !== current) {
			current?.pause();
			current = audio;
		}
	}}+++
	on:ended={() => {
		time = 0;
	}}
/>
```
