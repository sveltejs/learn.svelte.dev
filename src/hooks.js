/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event);

	response.headers.set('cross-origin-opener-policy', 'same-origin');
	response.headers.set('cross-origin-embedder-policy', 'require-corp');

	return response;
}
