<script>
	let x = 0;
</script>

<button on:click={() => x += 1}>+1</button>

{#if x > 10}
	<p>{x} is greater than 10</p>
{:else if x < 5}
	<p>{x} is less than 5</p>
{:else}
	<p>{x} is between 5 and 10</p>
{/if}