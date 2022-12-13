export async function GET({ request, params, fetch }) {
	const request_headers = new Headers();

	if (request.headers.has('range')) {
		request_headers.set('range', request.headers.get('range'));
	}

	if (request.headers.has('if-range')) {
		request_headers.set('if-range', request.headers.get('if-range'));
	}

	const response = await fetch(`https://sveltejs.github.io/assets/${params.path}`, {
		headers: request_headers
	});

	const response_headers = new Headers(response.headers);
	response_headers.set('cross-origin-resource-policy', 'cross-origin');

	return new Response(response.body, {
		status: response.status,
		headers: response_headers
	});
}
