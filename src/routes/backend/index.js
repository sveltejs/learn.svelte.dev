import { create } from './_apps';

/** @type {import('./__types/index').RequestHandler} */
export async function post() {
	return {
		status: 201, // should this be a 200?
		body: await create()
	};
}
