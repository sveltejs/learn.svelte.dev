<script>
	let selection = '';

	const handleSelectionChange = (e) => selection = document.getSelection();
</script>

<svelte:document />

<h1>Select this text to fire events</h1>
<p>Selection: {selection}</p>
