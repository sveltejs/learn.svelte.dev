import { get_index } from '$lib/server/content';

export function load() {
	return {
		index: get_index().map((part) => ({
			title: part.meta.title,
			slug: part.meta.slug,
			chapters: part.chapters.map((chapter) => ({
				title: chapter.meta.title,
				slug: chapter.meta.slug,
				exercises: chapter.exercises.map((exercise) => ({
					title: exercise.title,
					slug: exercise.slug
				}))
			}))
		}))
	};
}
