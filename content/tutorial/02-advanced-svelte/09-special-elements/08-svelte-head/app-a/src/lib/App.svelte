<script>
	const themes = ['margaritaville', 'retrowave', 'spaaaaace', 'halloween'];
	let selected = themes[0];
</script>

<h1>Bienvenue sur mon site !</h1>

<select bind:value={selected}>
	<option disabled>choisissez un thème</option>

	{#each themes as theme}
		<option>{theme}</option>
	{/each}
</select>
