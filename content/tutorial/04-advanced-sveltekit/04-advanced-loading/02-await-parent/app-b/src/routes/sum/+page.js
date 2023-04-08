export async function load({ parent }) {
	const { a, b } = await parent();
	return { c: a + b };
}
