import { sveltekit } from '@sveltejs/kit/vite';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import path from 'node:path';

/** @type {import('vite').UserConfig} */
export default {
	logLevel: 'info',

	css: {
		transformer: 'lightningcss',
		lightningcss: {
			targets: browserslistToTargets(browserslist(['>0.2%', 'not dead']))
		}
	},
	build: {
		target: 'esnext',
		cssMinify: 'lightningcss'
	},

	plugins: [
		// apply cross-origin isolation headers when previewing locally
		{
			name: 'cross-origin-isolation-for-preview',
			configurePreviewServer: (server) => {
				server.middlewares.use((_, res, next) => {
					res.setHeader('cross-origin-opener-policy', 'same-origin');
					res.setHeader('cross-origin-embedder-policy', 'require-corp');
					res.setHeader('cross-origin-resource-policy', 'cross-origin');
					next();
				});
			}
		},

		sveltekit()
	],

	server: {
		fs: {
			allow: [path.resolve('.apps')],
			strict: false
		},
		watch: {
			ignored: ['**/.apps/**']
		},
		headers: {
			'cross-origin-opener-policy': 'same-origin',
			'cross-origin-embedder-policy': 'require-corp',
			'cross-origin-resource-policy': 'cross-origin'
		}
	},

	ssr: {
		noExternal: ['@sveltejs/site-kit']
	},

	optimizeDeps: {
		exclude: ['@sveltejs/site-kit']
	}
};
