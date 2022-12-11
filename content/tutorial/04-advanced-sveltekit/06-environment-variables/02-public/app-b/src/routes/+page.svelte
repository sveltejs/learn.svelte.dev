<script>
	import {
		PUBLIC_THEME_BACKGROUND,
		PUBLIC_THEME_FOREGROUND
	} from '$env/static/public';
</script>

<main
	style:background={PUBLIC_THEME_BACKGROUND}
	style:color={PUBLIC_THEME_FOREGROUND}
>
	{PUBLIC_THEME_FOREGROUND} on {PUBLIC_THEME_BACKGROUND}
</main>

<style>
	main {
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		font-size: 10vmin;
	}
</style>
