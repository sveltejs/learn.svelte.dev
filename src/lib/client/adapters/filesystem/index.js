/**
 * @param {import('$lib/types').Stub[]} stubs
 * @returns {Promise<import('$lib/types').Adapter>}
 */
export async function create(stubs) {
	const res = await fetch('/backend', {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify(stubs)
	});

	const { id, port } = await res.json();

	const ws = new WebSocket('ws://localhost:4567');

	ws.addEventListener('message', (event) => {
		const payload = JSON.parse(event.data);
		if (payload.id === id) {
			console[payload.type === 'stdout' ? 'log' : 'error'](payload.data);
		}
	});

	return {
		base: `http://localhost:${port}`,

		/** @param {import('$lib/types').Stub[]} stubs */
		async update(stubs) {
			await fetch(`/backend/${id}`, {
				method: 'put',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(stubs)
			});
		},

		async destroy() {
			navigator.sendBeacon(`/backend/destroy?id=${id}`);
		}
	};
}
