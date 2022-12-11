import { error } from '@sveltejs/kit';

export function load({ cookies }) {
	if (!cookies.get('allowed')) {
		throw error(403, 'Forbidden');
	}
}
