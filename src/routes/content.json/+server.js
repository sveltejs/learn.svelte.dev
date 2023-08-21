import { get_exercise, get_index } from '$lib/server/content.js';
import { json } from '@sveltejs/kit';
import { markedTransform } from '@sveltejs/site-kit/markdown';

export const prerender = true;

export const GET = async () => {
	return json(await content());
};

async function content() {
	/** @type {import('@sveltejs/site-kit/search').Block[]} */
	const blocks = [];

	for (const { chapters } of await get_index()) {
		for (const { exercises } of chapters) {
			for (const { slug, title } of exercises) {
				const exercise_content = await get_exercise(slug);

				if (exercise_content) {
					exercise_content.markdown = exercise_content.markdown.replace(/(\+\+\+|---|:::)/g, '');

					blocks.push({
						href: `/tutorial/${slug}`,
						breadcrumbs: [title],
						content: await plaintext(exercise_content.markdown),
						rank: 0
					});
				}
			}
		}
	}

	return { blocks };
}

/** @param {string} markdown */
async function plaintext(markdown) {
	/** @param {unknown} text */
	const block = (text) => `${text}\n`;

	/** @param {string} text */
	const inline = (text) => text;

	return (
		await markedTransform(markdown, {
			code: (source) => source.split('// ---cut---\n').pop() ?? '',
			blockquote: block,
			html: () => '\n',
			heading: (text) => `${text}\n`,
			hr: () => '',
			list: block,
			listitem: block,
			checkbox: block,
			paragraph: (text) => `${text}\n\n`,
			table: block,
			tablerow: block,
			tablecell: (text, opts) => {
				return text + ' ';
			},
			strong: inline,
			em: inline,
			codespan: inline,
			br: () => '',
			del: inline,
			link: (href, title, text) => text,
			image: (href, title, text) => text,
			text: inline
		})
	)
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&#(\d+);/g, (match, code) => {
			return String.fromCharCode(code);
		})
		.trim();
}
