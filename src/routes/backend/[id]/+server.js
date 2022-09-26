import { clear, update } from './_apps';

/** @type {import('./__types/[id]').RequestHandler} */
export async function put({ url, request, params }) {
	const { id } = params;
	const files = await request.json();

	if (url.searchParams.has('reset')) {
		clear({ id, files });
	}

	update({ id, files });

	return {
		status: 201
	};
}
