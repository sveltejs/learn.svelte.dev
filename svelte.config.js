import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		vite: {
			server: {
				watch: {
					ignored: ['**/.apps/**']
				}
			}
		}
	}
};

export default config;
