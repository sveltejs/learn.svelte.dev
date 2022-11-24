<!-- @component
     A context menu for the tutorial's file tree
-->
<script context="module">
	import { writable } from 'svelte/store';

	/**
	 * @typedef {Array<{ name: string, action: () => void }>} MenuItems
	 */

	/**
	 * @type {import("svelte/store").Writable<{x: number; y: number; items: MenuItems} | null>}
	 */
	let menu_items = writable(null);

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {MenuItems} items
	 */
	export function open(x, y, items) {
		console.log('calling open');
		menu_items.set({ x, y, items });
	}
</script>

{#if $menu_items}
	<nav style="position: fixed; z-index: 1; top:{$menu_items.y}px; left:{$menu_items.x}px">
		<div class="navbar" id="navbar">
			<ul>
				{#each $menu_items.items as item}
					<li>
						<button on:click={item.action}>{item.name}</button>
					</li>
				{/each}
			</ul>
		</div>
	</nav>
{/if}

<svelte:window on:click={() => menu_items.set(null)} />

<style>
	.navbar {
		display: inline-flex;
		border: 1px var(--text) solid;
		width: 170px;
		background-color: var(--back);
		border-radius: 5px;
		overflow: hidden;
		flex-direction: column;
	}
	ul {
		margin: 1rem 0;
	}
	li {
		display: block;
		list-style-type: none;
		width: 1fr;
	}
	button {
		color: var(--text);
		width: 100%;
		height: 25px;
		text-align: left;
		border: 0px;
		padding: 0.5rem 1rem;
	}
	button:hover {
		text-align: left;
		background-color: var(--back-api);
	}
</style>
