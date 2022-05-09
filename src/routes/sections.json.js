// TODO turn this into a layout endpoint, when such things exist

import { get_index } from '$lib/server/content';

export function get() {
	return {
		body: {
			index: get_index().map((group) => ({
				title: group.meta.title,
				sections: group.sections.map((section) => ({
					title: section.title,
					slug: section.slug
				}))
			}))
		}
	};
}
