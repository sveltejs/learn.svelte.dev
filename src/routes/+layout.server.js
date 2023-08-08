import { get_index } from '$lib/server/content.js';

export const prerender = true;

export const load = () => {
	return {
		links: get_nav_list()
	};
};

/**
 * @returns {Promise<import('@sveltejs/site-kit').NavigationLink[]>}
 */
async function get_nav_list() {
	const index = await get_index();

	// console.log(index);

	console.log(index.map(({ chapters }) => chapters).flat());

	return [
		{
			title: 'Tutorial',
			prefix: 'tutorial',
			pathname: '/tutorial',
			sections: index
				.map(({ chapters }) => chapters)
				.flat()
				.map(({ title, exercises, slug }, index) => ({
					title: title,
					sections: exercises
						.map(({ slug, title }) => {
							return {
								title,
								path: `/tutorial/${slug}`
							};
						})
						.flat()
				}))
		}
	];
}
