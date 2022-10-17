export async function load({ fetch }) {
	const greeting = await fetch('/api?page').then((r) => r.text());
	return { greeting };
}
