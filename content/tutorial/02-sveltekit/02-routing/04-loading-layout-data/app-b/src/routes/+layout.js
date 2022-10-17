export async function load({ fetch }) {
	const greeting = await fetch('/api?layout').then((r) => r.text());
	return { greeting };
}
