/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// For the tutorial, we need to disable CSRF protection.
		// Don't do this in your own apps unless you know what you're doing!
		// See https://kit.svelte.dev/docs/configuration#csrf for more info.
		csrf: false
	}
};

export default config;
