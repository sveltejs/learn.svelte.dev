<script>
	let text = `Sélectionnez du texte et appuyez sur Tab pour mettre en majuscules`;

	async function handleKeydown(event) {
		if (event.key !== 'Tab') return;

		event.preventDefault();

		const { selectionStart, selectionEnd, value } = this;
		const selection = value.slice(selectionStart, selectionEnd);

		const replacement = /[a-z]/.test(selection)
			? selection.toUpperCase()
			: selection.toLowerCase();

		text =
			value.slice(0, selectionStart) +
			replacement +
			value.slice(selectionEnd);

		// ceci n'a aucun effet, car le DOM n'est pas encore à jour
		this.selectionStart = selectionStart;
		this.selectionEnd = selectionEnd;
	}
</script>

<textarea
	value={text}
	on:keydown={handleKeydown}
/>

<style>
	textarea {
		width: 100%;
		height: 100%;
		resize: none;
	}
</style>
