import { get_section } from '$lib/server/content';

/** @type {import('./__types/index').RequestHandler} */
export function get({ params }) {
	const section = get_section(params.slug);

	if (section) {
		return {
			body: { section }
		};
	}

	return { status: 404 };
}
