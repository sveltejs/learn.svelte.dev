import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
	const response = await fetch(`/api/blog/${params.slug}`);

	if (!response.ok) {
		throw error(response.status);
	}

	return { post: response.json() };
}
