<script>
	import { createEventDispatcher } from 'svelte';
	import refresh from '$lib/icons/refresh.svg';

	/** @type {string} */
	export let path;

	/** @type {boolean} */
	export let loading;

	const dispatch = createEventDispatcher();
</script>

<div class="chrome">
	<button disabled={loading} on:click={() => dispatch('refresh')} aria-label="reload">
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
		transition: 0.2s ease-out;
		transform: none;
	}

	.chrome button:active img {
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
</style>
