<script>
	import { page } from '$app/stores';
</script>

<div class="color" style="--color: #{$page.params.color}">
	<span>#{$page.params.color}</span>
</div>

<style>
	.color {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color);
		transition: background-color 0.2s;
	}

	span {
		mix-blend-mode: soft-light;
		color: black;
		font-size: 4em;
	}
</style>
