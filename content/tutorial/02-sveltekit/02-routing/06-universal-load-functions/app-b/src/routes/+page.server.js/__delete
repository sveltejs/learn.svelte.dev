import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	const response = await fetch('https://api.hnpwa.com/v0/news/1.json');

	if (!response.ok) {
		throw error(response.status);
	}

	const items = await response.json();

	return {
		items
	};
}
