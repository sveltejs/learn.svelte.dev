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
		async reset(stubs) {
			await fetch(`/backend/${id}?reset`, {
				method: 'put',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(stubs)
			});

			await new Promise((f) => setTimeout(f, 100)); // wait for chokidar

			return true; // always reload page, not worth optimizing for local dev at this point
		},

		/** @param {import('$lib/types').FileStub[]} stubs */
		async update(stubs) {
			await fetch(`/backend/${id}`, {
				method: 'put',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(stubs)
			});

			await new Promise((f) => setTimeout(f, 100)); // wait for chokidar
		},

		async destroy() {
			navigator.sendBeacon(`/backend/destroy?id=${id}`);
		}
	};
}
