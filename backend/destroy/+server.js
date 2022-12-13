import { destroy } from '../apps';

// this is implemented as a POST handler because it is
// triggered by `navigator.sendBeacon` rather than `fetch`

/** @type {import('./$types').RequestHandler} */
export function POST({ url }) {
	const id = /** @type {string} */ (url.searchParams.get('id'));
	destroy({ id });

	return new Response(undefined, {
		status: 204
	});
}
