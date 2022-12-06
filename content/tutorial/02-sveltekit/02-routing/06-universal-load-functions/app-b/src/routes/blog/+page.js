import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	const response = await fetch('/api/blog');

	if (!response.ok) {
		throw error(response.status);
	}

	const summaries = await response.json();

	return {
		summaries
	};
}
