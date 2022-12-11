<script>
	import { page } from '$app/stores';
</script>

<div class="color" style="--color: #{$page.params.color}">
	<span>#{$page.params.color}</span>
</div>

<style>
	.color {
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background-color: var(--color);
	}
</style>
