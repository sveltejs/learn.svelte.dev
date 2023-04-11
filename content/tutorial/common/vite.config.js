import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],

	// Normally this would be unnecessary, but we
	// need it for learn.svelte.dev
	server: {
		fs: {
			strict: false
		}
	}
});
