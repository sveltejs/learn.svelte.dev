export async function load({ fetch }) {
	const response = await fetch('/api/clock');
	return response.json();
}
