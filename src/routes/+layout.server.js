export const prerender = true;

export const load = async ({ fetch }) => {
	return {
		links: await fetch('/nav.json').then((r) => r.json())
	};
};
