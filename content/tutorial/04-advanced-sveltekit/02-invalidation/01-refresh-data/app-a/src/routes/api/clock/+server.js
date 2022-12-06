import { json } from '@sveltejs/kit';

export function GET() {
	return json({ time: new Date().toLocaleTimeString() });
}
