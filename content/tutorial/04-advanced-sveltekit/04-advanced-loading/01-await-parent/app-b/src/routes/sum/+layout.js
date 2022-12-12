export async function load({ parent }) {
	const { a } = await parent();
	return { b: a + 1 };
}
