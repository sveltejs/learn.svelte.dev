import { update } from './_apps';

/** @type {import('./__types/[id]').RequestHandler} */
export async function put({ request, params }) {
	update({
		id: params.id,
		files: await request.json()
	});

	return {
		status: 201
	};
}
