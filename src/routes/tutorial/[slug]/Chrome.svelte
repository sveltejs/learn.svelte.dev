<script>
	import { createEventDispatcher } from 'svelte';

	/** @type {string} */
	export let path;

	/** @type {boolean} */
	export let loading;

	/** @type {string | null} */
	export let href;

	const dispatch = createEventDispatcher();
</script>

<div class="chrome" class:loading>
	<button disabled={loading} class="reload icon" on:click={() => dispatch('refresh')} aria-label="reload" />

	<input
		disabled={loading}
		aria-label="URL"
		value={path}
		on:change={(e) => {
			dispatch('change', { value: e.currentTarget.value });
		}}
		on:keydown={(e) => {
			if (e.key === 'Enter') {
				dispatch('change', { value: e.currentTarget.value });
				e.currentTarget.blur();
			}
		}}
	/>

	<a {href} class="new-tab icon" target="_blank" aria-label={href ? 'open in new tab' : undefined} tabindex="0" />

	<button
		disabled={loading}
		class="terminal icon"
		on:click={() => dispatch('toggle_terminal')}
		aria-label="toggle terminal"
	/>
</div>

<style>
	.chrome {
		width: 100%;
		height: 4rem;
		display: flex;
		border-top: 1px solid var(--sk-back-4);
	}

	button {
		user-select: none;
	}

	input {
		flex: 1;
		padding: 0.5rem 1rem 0.4rem 1rem;
		background-color: var(--sk-back-3);
		color: var(--sk-text-1);
		font-family: inherit;
		font-size: 1.6rem;
	}

	a:focus-visible,
	button:focus-visible,
	input:focus-visible {
		outline: none;
		border: 2px solid var(--sk-theme-3);
	}

	.icon, .icon::after {
		position: relative;
		height: 100%;
		aspect-ratio: 1;
		background: var(--sk-back-4) no-repeat 50% 50%;
		background-size: 2rem;
	}

	.loading a {
		opacity: 0.5;
	}

	.new-tab {
		background-image: url($lib/icons/external.svg);
	}

	.terminal {
		background-image: url($lib/icons/terminal.svg);
	}

	.reload::after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		background-image: url($lib/icons/refresh.svg);
		transition: 0.2s ease-out;
	}

	.reload:active::after {
		transform: rotate(-360deg);
		transition: none;
	}
</style>
