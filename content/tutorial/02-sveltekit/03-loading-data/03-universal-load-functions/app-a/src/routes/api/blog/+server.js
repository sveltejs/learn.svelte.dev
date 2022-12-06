import { json } from '@sveltejs/kit';
import { posts } from './data';

export function GET() {
	return json(posts.map((post) => ({ title: post.title, slug: post.slug })));
}
