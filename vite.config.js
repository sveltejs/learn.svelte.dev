import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
export default {
	build: {
		target: 'esnext'
	},

	plugins: [sveltekit()],

	server: {
		fs: {
			allow: [path.resolve('.apps')]
		},
		watch: {
			ignored: ['**/.apps/**']
		}
	}
};
