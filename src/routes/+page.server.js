import { redirect } from '@sveltejs/kit';

export function load() {
	redirect(307, '/tutorial/welcome-to-svelte');
}
