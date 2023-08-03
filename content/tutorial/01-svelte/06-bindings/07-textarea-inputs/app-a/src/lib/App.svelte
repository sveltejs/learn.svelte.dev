<script>
	import { marked } from 'marked';
	let value = `Certains mots sont en *italique*, d'autres sont en **gras**`;
</script>

<div class="grid">
	input
	<textarea {value}></textarea>

	valeur saisie
	<div>{@html marked(value)}</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 5em 1fr;
		grid-template-rows: 1fr 1fr;
		grid-gap: 1em;
		height: 100%;
	}

	textarea {
		flex: 1;
		resize: none;
	}
</style>
