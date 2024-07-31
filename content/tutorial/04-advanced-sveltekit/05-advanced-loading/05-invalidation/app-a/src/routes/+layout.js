export async function load({ fetch }) {
	const response = await fetch('/api/now');
	const now = await response.json();

	return {
		now
	};
}
