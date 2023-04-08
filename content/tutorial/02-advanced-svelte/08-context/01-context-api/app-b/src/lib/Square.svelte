<script>
	import { getContext } from 'svelte';

	export let x;
	export let y;
	export let size;
	export let rotate;

	getContext('canvas').addItem(draw);

	function draw(ctx) {
		ctx.save();

		ctx.translate(x, y);
		ctx.rotate(rotate);

		ctx.strokeStyle = 'black';
		ctx.strokeRect(-size / 2, -size / 2, size, size);

		ctx.restore();
	}
</script>