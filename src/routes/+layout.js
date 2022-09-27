export const prerender = true;

/** @type {import('./$types').LayoutLoad} */
export async function load({ fetch }) {
	const res = await fetch('/tutorial.json');
	const { index } = await res.json();

	return {
		index
	};
}
