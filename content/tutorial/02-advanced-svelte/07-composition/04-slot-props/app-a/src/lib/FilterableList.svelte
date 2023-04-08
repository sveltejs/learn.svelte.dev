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

	<div class="header">
		<slot name="header"/>
	</div>
	
	<div class="content">
		{#each data.filter(matches) as item}
			<slot />
		{/each}
	</div>
</div>

<style>
	.list {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.header {
		border-top: 1px solid var(--bg-2);
		padding: 0.2em 0;
	}

	.content {
		flex: 1;
		overflow: auto;
		padding-top: 0.5em;
		border-top: 1px solid var(--bg-2);
	}
</style>