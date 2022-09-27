import { clear, update } from '../apps';

/** @type {import('./$types').RequestHandler} */
export async function PUT({ url, request, params }) {
	const { id } = params;
	const files = await request.json();

	if (url.searchParams.has('reset')) {
		clear({ id, files });
	}

	update({ id, files });

	return new Response(undefined, {
		status: 201
	});
}
