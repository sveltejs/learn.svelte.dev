<script>
	import ToggleButton from './ToggleButton.svelte';

	/** @type {{pressed: boolean; on_change?: (pressed: boolean) => void}} */
	let { pressed = false, on_change } = $props();
</script>

<div class="input-output-toggle">
	<button
		aria-hidden="true"
		onclick={() => {
			if (pressed) {
				pressed = false;
				on_change?.(pressed);
			}
		}}>Tutorial</button
	>
	<ToggleButton label="Show editor" {pressed} {on_change} />
	<button
		aria-hidden="true"
		onclick={() => {
			if (!pressed) {
				pressed = true;
				on_change?.(pressed);
			}
		}}>Editor</button
	>
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
		box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.07);
	}

	@media (min-width: 832px) {
		.input-output-toggle {
			padding-left: 3.2rem;
			width: var(--sidebar-menu-width);
			margin: 0 0 0 auto;
		}
	}
</style>
