<script>
	let count = 0;

	function increment() {
		count += 1;
	}
</script>

<button on:click={increment}>
	Il y a eu {count}
	{count === 1 ? 'clic' : 'clics'}
</button>
