<script>
	let count = 0;

	$: if (count >= 10) {
		alert('le compteur est dangereusement élevé !');
		count = 0;
	}

	function handleClick() {
		count += 1;
	}
</script>

<button on:click={handleClick}>
	Il y a eu {count}
	{count === 1 ? 'clic' : 'clics'}
</button>
