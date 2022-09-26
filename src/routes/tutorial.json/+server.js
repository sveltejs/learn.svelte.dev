// TODO turn this into a layout endpoint, when such things exist

import { get_index } from '$lib/server/content';

export function get() {
	return {
		body: {
			index: get_index().map((part) => ({
				title: part.meta.title,
				slug: part.meta.slug,
				chapters: part.chapters.map((chapter) => ({
					title: chapter.meta.title,
					slug: chapter.meta.slug,
					sections: chapter.sections.map((section) => ({
						title: section.title,
						slug: section.slug
					}))
				}))
			}))
		}
	};
}
