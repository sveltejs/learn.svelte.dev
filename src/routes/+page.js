import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load() {
	throw redirect(307, '/tutorial/welcome-to-svelte');
}
