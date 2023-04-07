<script>
	export let data;
	export let field;

	let search = '';

	$: regex = search ? new RegExp(search, 'i') : null;
	$: matches = (item) => regex ? regex.test(item[field]) : true;
</script>

<div class="list">
	<label>
		Filter: <input bind:value={search} />
	</label>
	
	<div class="content">
		{#each data.filter(matches) as item}
			<slot {item} />
		{/each}
	</div>
</div>

<style>
	.list {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.content {
		flex: 1;
		overflow: auto;
	}
</style>