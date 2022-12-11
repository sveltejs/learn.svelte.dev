/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		csrf: false // needed for the form actions tutorial, web container stuff makes this necessary
	}
};

export default config;
