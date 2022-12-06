import { posts } from './data.js';

/** @type {import('./$types').PageServerLoad} */
export function load() {
	return {
		summaries: posts.map((post) => ({
			slug: post.slug,
			title: post.title
		}))
	};
}
