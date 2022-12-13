<main>
	<slot />
</main>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
			Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
			sans-serif;
		margin: 0;
	}

	:global(input) {
		display: inline-block;
	}
	:global(label) {
		display: block;
	}

	main {
		width: 100%;
		height: 100vh;
		box-sizing: border-box;
		padding: 8px;
	}
</style>
