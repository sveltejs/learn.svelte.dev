import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		vite: {
			optimizeDeps: {
				include: ['cjs-dep']
			}
		}
	}
};

export default config;
