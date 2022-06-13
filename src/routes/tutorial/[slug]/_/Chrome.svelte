<script>
	import { createEventDispatcher } from 'svelte';
	import refresh from './refresh.svg';

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
		background: #f9f9f9;
		border-top: 1px solid var(--border-color);
	}

	.chrome button {
		padding: 0.8rem;
		box-sizing: border-box;
		background: #f3f3f3;
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
		background-color: #fbfbfb;
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
		border: 2px solid var(--flash);
	}
</style>
