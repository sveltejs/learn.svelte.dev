<script>
	/** @type {import('$lib/types').File | null} */
	export let file;
</script>

<textarea value={file ? file.contents : 'loading...'} on:input />

<style>
	textarea {
		width: 100%;
		height: 100%;
		resize: none;
		border: none;
		padding: 1rem;
		box-sizing: border-box;
		tab-size: 2;
	}
</style>
