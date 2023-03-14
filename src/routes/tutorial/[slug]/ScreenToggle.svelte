<script>
	import ToggleButton from './ToggleButton.svelte';

	/** @type {boolean} */
	export let selected;
</script>

<div class="input-output-toggle">
	<span aria-hidden="true">Tutorial</span>
	<ToggleButton bind:pressed={selected} label="Show editor" />
	<span aria-hidden="true">Editor</span>
</div>

<style>
	.input-output-toggle {
		position: relative;
		display: flex;
		gap: 0.5em;
		user-select: none;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		z-index: 2;
		margin: 0 auto;
	}

	@media (min-width: 832px) {
		.input-output-toggle {
			padding-left: 3.2rem;
			width: var(--sidebar-menu-width);
			margin: 0 0 0 auto;
		}
	}
</style>
