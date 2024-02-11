<script>
	let count = 0;
	$: doubled = count * 2;

	function increment() {
		count += 1;
	}
</script>

<button on:click={increment}>
	Il y a eu {count}
	{count === 1 ? 'clic' : 'clics'}
</button>

<p>{count} fois 2  vaut {doubled}</p>
