<script>
	let visible = true;
</script>

<label>
	<input type="checkbox" bind:checked={visible} />
	visible
</label>

{#if visible}
	<p>
		Entre et sort en s'estompant
	</p>
{/if}
