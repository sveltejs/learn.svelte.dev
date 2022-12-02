import { error } from '@sveltejs/kit';

export function load({ url }) {
	throw error(404, `Page ${url.pathname} not found`);
}
