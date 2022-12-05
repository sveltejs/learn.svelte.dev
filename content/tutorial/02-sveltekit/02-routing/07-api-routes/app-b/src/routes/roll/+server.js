import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET() {
	const number = Math.ceil(Math.random() * 6);

	return json(number);
}
