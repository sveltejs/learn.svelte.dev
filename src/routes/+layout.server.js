export const prerender = true;

export const load = async ({ fetch }) => {
	return {
		links: fetch('/nav.json').then((r) => r.json())
	};
};
