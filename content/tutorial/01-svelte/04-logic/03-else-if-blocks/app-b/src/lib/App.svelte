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

{#if count > 10}
	<p>{count} est supérieur à 10</p>
{:else if count < 5}
	<p>{count} est inférieur à 5</p>
{:else}
	<p>{count} est compris entre 5 et 10</p>
{/if}