export async function load({ data }) {
	return { greeting: data.greeting + ' and the shared load function' };
}
