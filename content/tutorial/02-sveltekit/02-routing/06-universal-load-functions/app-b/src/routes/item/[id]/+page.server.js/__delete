import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
	const response = await fetch(`https://api.hnpwa.com/v0/item/${params.id}.json`);

	if (!response.ok) {
		throw error(response.status);
	}

	return response.json();
}
