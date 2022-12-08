import { error } from '@sveltejs/kit';
import { posts } from '../data.js';

export function load({ params }) {
	const post = posts.find((post) => post.slug === params.slug);

	if (!post) throw error(404);

	return {
		post
	};
}
