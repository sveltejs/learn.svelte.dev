import { get_section } from '$lib/server/content';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
	const section = get_section(params.slug);

	if (section) {
		return {
			section
		};
	}

	throw error(404, 'No such tutorial found');
}
