import { get_index } from '$lib/server/content.js';
import { json } from '@sveltejs/kit';

export const prerender = true;

export const GET = async () => {
	return json(await get_nav_list());
};

/**
 * @returns {Promise<import('@sveltejs/site-kit').NavigationLink[]>}
 */
async function get_nav_list() {
	const index = await get_index();

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
