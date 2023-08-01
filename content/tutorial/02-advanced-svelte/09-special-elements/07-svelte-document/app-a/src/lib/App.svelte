<script>
	let selection = '';

	const handleSelectionChange = (e) => selection = document.getSelection();
</script>

<svelte:document />

<p>Sélectionner ce texte pour déclencher des évènements</p>
<p>Sélection: {selection}</p>
