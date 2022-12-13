import { json } from '@sveltejs/kit';
import { create } from './apps';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	return json(
		await create({
			files: await request.json()
		}),
		{
			status: 201 // should this be a 200?
		}
	);
}
