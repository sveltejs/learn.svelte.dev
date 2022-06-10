import path from 'path';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		vite: {
			build: {
				target: 'esnext'
			},

			server: {
				fs: {
					allow: [path.resolve('.apps')]
				},
				watch: {
					ignored: ['**/.apps/**']
				}
			}
		}
	}
};

export default config;
