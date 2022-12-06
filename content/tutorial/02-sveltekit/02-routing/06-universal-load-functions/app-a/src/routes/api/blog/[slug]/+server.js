import { json } from '@sveltejs/kit';
import { posts } from '../data';

export function GET({ params }) {
	return json(posts.find((post) => post.slug === params.slug));
}
