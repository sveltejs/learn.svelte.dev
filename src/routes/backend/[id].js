import { update } from './_apps';

/** @type {import('./__types/[id]').RequestHandler} */
export async function put({ request, params, url }) {
	update({
		id: params.id,
		port: /** @type {string} */ (url.searchParams.get('port')),
		files: await request.json()
	});

	return {
		status: 201
	};
}
