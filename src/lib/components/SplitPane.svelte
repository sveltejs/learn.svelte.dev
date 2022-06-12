<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	/** @type {'horizontal' | 'vertical'} */
	export let type;
	export let pos = '50%';
	export let disabled = false;
	export let min = '0%';
	export let max = '100%';

	/** @type {'min' | 'max'}*/
	export let priority = 'min';

	/** @type {HTMLElement} */
	let container;

	let dragging = false;
	let w = 0;
	let h = 0;

	// constrain pos
	$: if (container) {
		const size = type === 'horizontal' ? w : h;

		let min_px = parseFloat(min);
		let max_px = parseFloat(max);
		let pos_px = parseFloat(pos);

		if (min.endsWith('%')) min_px = (size * min_px) / 100;
		if (max.endsWith('%')) max_px = (size * max_px) / 100;
		if (pos.endsWith('%')) pos_px = (size * pos_px) / 100;

		if (min_px < 0) min_px += size;
		if (max_px < 0) max_px += size;

		pos_px =
			priority === 'min'
				? Math.max(min_px, Math.min(max_px, pos_px))
				: Math.min(max_px, Math.max(min_px, pos_px));

		pos = pos.endsWith('%') ? `${(100 * pos_px) / size}%` : `${pos_px}px`;
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	function update(x, y) {
		if (disabled) return;

		const { top, left } = container.getBoundingClientRect();

		const pos_px = type === 'horizontal' ? x - left : y - top;
		const size = type === 'horizontal' ? w : h;

		pos = pos.endsWith('%') ? `${(100 * pos_px) / size}%` : `${pos_px}px`;

		dispatch('change');
	}

	/**
	 * @param {HTMLElement} node
	 * @param {(event: MouseEvent) => void} callback
	 */
	function drag(node, callback) {
		/** @param {MouseEvent} event */
		const mousedown = (event) => {
			if (event.which !== 1) return;

			event.preventDefault();

			dragging = true;

			const onmouseup = () => {
				dragging = false;

				window.removeEventListener('mousemove', callback, false);
				window.removeEventListener('mouseup', onmouseup, false);
			};

			window.addEventListener('mousemove', callback, false);
			window.addEventListener('mouseup', onmouseup, false);
		};

		node.addEventListener('mousedown', mousedown, false);

		return {
			destroy() {
				node.removeEventListener('mousedown', mousedown, false);
			}
		};
	}

	/**
	 * @param {HTMLElement} node
	 * @param {(event: TouchEvent) => void} callback
	 */
	function touchDrag(node, callback) {
		/** @param {TouchEvent} event */
		const touchdown = (event) => {
			if (event.targetTouches.length > 1) return;

			event.preventDefault();

			dragging = true;

			const ontouchend = () => {
				dragging = false;

				window.removeEventListener('touchmove', callback, false);
				window.removeEventListener('touchend', ontouchend, false);
			};

			window.addEventListener('touchmove', callback, false);
			window.addEventListener('touchend', ontouchend, false);
		};

		node.addEventListener('touchstart', touchdown, false);

		return {
			destroy() {
				node.removeEventListener('touchstart', touchdown, false);
			}
		};
	}
</script>

<div
	class="container {type}"
	bind:this={container}
	bind:clientWidth={w}
	bind:clientHeight={h}
	style="--pos: {pos}"
>
	<div class="pane">
		<slot name="a" />
	</div>

	<div class="pane">
		<slot name="b" />
	</div>

	<div
		class="{type} divider"
		class:disabled
		use:drag={(e) => update(e.clientX, e.clientY)}
		use:touchDrag={(e) => update(e.touches[0].clientX, e.touches[0].clientY)}
	/>
</div>

{#if dragging}
	<div class="mousecatcher" />
{/if}

<style>
	.container {
		--sp-thickness: var(--thickness, 8px);
		/* --sp-color: var(--color, #eee); */
		--sp-color: transparent;
		display: grid;
		position: relative;
		width: 100%;
		height: 100%;
	}

	.container.vertical {
		grid-template-rows: var(--pos) 1fr;
	}

	.container.horizontal {
		grid-template-columns: var(--pos) 1fr;
	}

	.pane {
		float: left;
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	.pane > :global(*) {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.mousecatcher {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.01);
	}

	.divider {
		position: absolute;
		z-index: 10;
	}

	.divider::after {
		content: '';
		position: absolute;
		background-color: var(--sp-color);
	}

	.horizontal > .divider {
		padding: 0 calc(0.5 * var(--sp-thickness));
		width: 0;
		height: 100%;
		cursor: ew-resize;
		left: var(--pos);
		transform: translate(calc(-0.5 * var(--sp-thickness)), 0);
	}

	.horizontal > .divider.disabled {
		cursor: default;
	}

	.horizontal > .divider::after {
		left: 50%;
		top: 0;
		width: 1px;
		height: 100%;
	}

	.vertical > .divider {
		padding: calc(0.5 * var(--sp-thickness)) 0;
		width: 100%;
		height: 0;
		cursor: ns-resize;
		top: var(--pos);
		transform: translate(0, calc(-0.5 * var(--sp-thickness)));
	}

	.vertical > .divider.disabled {
		cursor: default;
	}

	.vertical > .divider::after {
		top: 50%;
		left: 0;
		width: 100%;
		height: 1px;
	}
</style>
