<script>
	const emojis = {
		pomme: '🍎',
		banane: '🍌',
		carotte: '🥕',
		donut: '🍩',
		oeuf: '🥚'
	};

	// le nom est mis à jour à chaque fois que la valeur de la prop change...
	export let name;

	// ...but the "emoji" variable is fixed upon initialisation
	// parce qu'elle utilise "const" à la place de "$:"
	const emoji = emojis[name];
</script>

<p>{emoji} = {name}</p>
