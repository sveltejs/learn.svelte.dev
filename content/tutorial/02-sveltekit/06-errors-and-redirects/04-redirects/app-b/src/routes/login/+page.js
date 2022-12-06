import { redirect } from '@sveltejs/kit';

export function load() {
	// let's assume for simplicity we are always logged in
	throw redirect(307, '/user');
}
