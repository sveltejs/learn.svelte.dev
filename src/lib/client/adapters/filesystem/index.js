/**
 * @returns {Promise<import('$lib/types').Adapter>}
 */
export async function create() {
	const res = await fetch('/backend', {
		method: 'post'
	});

	const { id, port } = await res.json();

	return {
		base: `http://localhost:${port}`,

		/** @param {TODO} files */
		async update(files) {
			await fetch(`/backend/${id}?port=${port}`, {
				method: 'put',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(files)
			});
		},

		async destroy() {
			await fetch(`/backend/${id}`, {
				method: 'delete'
			});
		}
	};
}
