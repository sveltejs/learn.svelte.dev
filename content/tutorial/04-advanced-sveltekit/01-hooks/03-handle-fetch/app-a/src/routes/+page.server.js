export async function load({ fetch }) {
	const response = await fetch('/a');

	return {
		message: await response.text()
	};
}