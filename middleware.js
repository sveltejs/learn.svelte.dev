export default function middleware(_request, _event) {
	const response = new Response();

	response.headers.set('cross-origin-opener-policy', 'same-origin');
	response.headers.set('cross-origin-embedder-policy', 'require-corp');
	response.headers.set('cross-origin-resource-policy', 'cross-origin');
	response.headers.set('x-middleware-next', '1');

	return response;
}
