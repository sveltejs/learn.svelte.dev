<script>
	import { env } from '$env/dynamic/public';
</script>

<main
	style:background={env.PUBLIC_THEME_BACKGROUND}
	style:color={env.PUBLIC_THEME_FOREGROUND}
>
	{env.PUBLIC_THEME_FOREGROUND} on {env.PUBLIC_THEME_BACKGROUND}
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
