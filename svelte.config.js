import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'@sveltejs/site-kit': './src/site-kit'
		}
	}
};

export default config;
