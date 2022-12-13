<script>
	/** @type {string[]} */
	export let labels;
	export let selected = 0;
</script>

<div class="toggle">
	{#each labels as label, index}
		<button class:selected={selected === index} on:click={() => (selected = index)}>
			{label}
		</button>
	{/each}
</div>

<style>
	.toggle {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: var(--toggle-height);
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 1px solid var(--sk-text-2);
		background-color: var(--sk-back-1);
	}
	button {
		margin: 0 0.15em;
		width: 4em;
		height: 1em;
		padding: 0.3em 0.4em;
		border-radius: var(--sk-border-radius);
		line-height: 1em;
		box-sizing: content-box;
		color: var(--sk-text-2);
		border: 1px solid var(--sk-back-3);
	}
	.selected {
		background-color: var(--sk-theme-1);
		color: white;
	}
</style>
