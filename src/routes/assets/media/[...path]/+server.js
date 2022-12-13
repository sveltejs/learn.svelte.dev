export async function GET({ request, params, fetch }) {
	const response = await fetch(`https://sveltejs.github.io/assets/${params.path}`, {
		headers: request.headers
	});

	const headers = new Headers(response.headers);
	headers.set('cross-origin-resource-policy', 'cross-origin');

	return new Response(response.body, {
		status: response.status,
		headers
	});
}
