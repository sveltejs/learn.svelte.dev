<script>
	import { createEventDispatcher } from 'svelte';
	import ToggleButton from './ToggleButton.svelte';

	/** @type {boolean} */
	export let pressed = false;

	const dispatch = createEventDispatcher();
</script>

<div class="input-output-toggle">
	<button
		aria-hidden="true"
		on:click={() => {
			if (pressed) {
				pressed = false;
				dispatch('change', { pressed });
			}
		}}>Tutorial</button
	>
	<ToggleButton label="Show editor" {pressed} on:change />
	<button
		aria-hidden="true"
		on:click={() => {
			if (!pressed) {
				pressed = true;
				dispatch('change', { pressed });
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
	}

	@media (min-width: 832px) {
		.input-output-toggle {
			padding-left: 3.2rem;
			width: var(--sidebar-menu-width);
			margin: 0 0 0 auto;
		}
	}
</style>
