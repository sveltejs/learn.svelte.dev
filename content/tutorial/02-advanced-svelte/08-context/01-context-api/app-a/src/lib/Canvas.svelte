<script>
	import { afterUpdate, onMount, tick } from 'svelte';

	export let width = 100;
	export let height = 100;

	let canvas, ctx;
	let items = new Set();
	let scheduled = false;

	onMount(() => {
		ctx = canvas.getContext('2d');
	});

	function addItem(fn) {
		onMount(() => {
			items.add(fn);
			return () => items.delete(fn);
		});
		
		afterUpdate(async () => {
			if (scheduled) return;
			
			scheduled = true;
			await tick();
			scheduled = false;

			draw();
		});
	}

	function draw() {
		ctx.clearRect(0, 0, width, height);
		items.forEach(fn => fn(ctx));
	}
</script>

<canvas bind:this={canvas} {width} {height}>
	<slot />
</canvas>

<style>
	canvas {
		width: 100%;
		height: 100%;
	}
</style>