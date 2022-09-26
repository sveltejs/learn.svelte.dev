import { destroy } from './_apps';

// this is implemented as a POST handler because it is
// triggered by `navigator.sendBeacon` rather than `fetch`

/** @type {import('./__types/destroy').RequestHandler} */
export function post({ url }) {
	const id = /** @type {string} */ (url.searchParams.get('id'));
	destroy({ id });

	return {};
}
