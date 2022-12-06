import { json } from '@sveltejs/kit';

export function GET() {
	const number = Math.ceil(Math.random() * 6);

	return json(number);
}
