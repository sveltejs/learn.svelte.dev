<script>
	let m = { x: 0, y: 0 };
</script>

<div
	on:mousemove={(e) => {
		m = { x: e.clientX, y: e.clientY };
	}}
>
	The mouse position is {m.x} x {m.y}
</div>

<style>
	div {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		padding: 1rem;
	}
</style>
