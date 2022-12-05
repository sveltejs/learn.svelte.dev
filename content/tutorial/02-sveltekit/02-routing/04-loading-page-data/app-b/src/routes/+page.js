export async function load({ fetch }) {
	const greeting = await fetch('/api').then((r) => r.text());
	return { greeting };
}
