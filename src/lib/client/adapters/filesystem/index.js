/**
 * @param {import('$lib/types').Stub[]} stubs
 * @param {(progress: number, status: string) => void} cb
 * @returns {Promise<import('$lib/types').AdapterInternal>}
 */
export async function create(stubs, cb) {
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

	cb(100, 'Ready');

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

			return will_restart_vite_dev_server(stubs);
		},

		async destroy() {
			navigator.sendBeacon(`/backend/destroy?id=${id}`);
		}
	};
}

/**
 * @param {import('$lib/types').Stub[]} stubs
 */
function will_restart_vite_dev_server(stubs) {
	return stubs.some(
		(stub) =>
			stub.type === 'file' &&
			(stub.name === '/vite.config.js' ||
				stub.name === '/svelte.config.js' ||
				stub.name === '/.env')
	);
}
