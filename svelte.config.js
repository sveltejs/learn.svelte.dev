import * as child_process from 'node:child_process';
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['<all>'],
      },
    }),

		prerender: {
			concurrency: 4
		},

		version: {
			name: child_process.execSync('git rev-parse HEAD').toString().trim()
		}
	}
};

export default config;
