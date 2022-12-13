export async function GET({ params, fetch }) {
	const response = await fetch(`https://sveltejs.github.io/assets/${params.path}`);

	const headers = new Headers(response.headers);
	headers.set('cross-origin-resource-policy', 'cross-origin');

	return new Response(response.body, {
		status: response.status,
		headers
	});
}
