<script>
	import { createEventDispatcher } from 'svelte';
	import chevron from './chevron.svg';
	import refresh from './refresh.svg';

	/** @type {string} */
	export let path;

	/** @type {string[]} */
	export let history_bwd = [];

	/** @type {string[]} */
	export let history_fwd = [];

	/** @type {boolean} */
	export let loading;

	const dispatch = createEventDispatcher();

	$: [disabledBwd, disabledFwd] = [loading || !history_bwd.length, loading || !history_fwd.length];
</script>

<div class="chrome">
	<button disabled={disabledBwd} on:click={() => dispatch('back')} aria-label="go back">
		<img src={chevron} alt="Back icon" />
	</button>
	<button disabled={disabledFwd} on:click={() => dispatch('forward')} aria-label="go forward">
		<img src={chevron} style="transform: rotate(180deg)" alt="Forward icon" />
	</button>
	<button
		class="refresh"
		disabled={loading}
		on:click={() => dispatch('refresh')}
		aria-label="reload"
	>
		<img src={refresh} alt="Reload icon" />
	</button>

	<input
		disabled={loading}
		aria-label="URL"
		value={path}
		on:change={(e) => {
			dispatch('change', { value: e.currentTarget.value });
		}}
	/>
</div>

<style>
	.chrome {
		width: 100%;
		height: 4rem;
		display: flex;
		border-top: 1px solid var(--sk-back-4);
	}

	.chrome button {
		padding: 0.8rem;
		box-sizing: border-box;
		background: var(--sk-back-4);
	}

	.chrome button img {
		width: 2rem;
		height: 2rem;
		transition: transform 0.2s ease-out, opacity 0.1s ease-out;
		transform: none;
	}

	.chrome button.refresh:active img {
		transform: rotate(-360deg);
		transition: none;
	}

	.chrome input {
		flex: 1;
		padding: 0.5rem 1rem 0.4rem 1rem;
		background-color: var(--sk-back-3);
		color: var(--sk-text-1);
		font-family: inherit;
		font-size: 1.6rem;
	}

	.chrome button,
	.chrome input {
		border: 2px solid transparent;
	}

	.chrome button:focus-visible,
	.chrome input:focus-visible {
		outline: none;
		border: 2px solid var(--sk-theme-3);
	}

	.chrome button {
		user-select: none;
	}

	.chrome button[disabled] {
		opacity: 1;
	}

	.chrome button[disabled] img {
		opacity: 0.5;
	}

	.chrome button img {
		opacity: 0.8;
	}

	.chrome button:hover img,
	.chrome button:active img,
	.chrome button:focus-visible img {
		opacity: 1;
	}
</style>
