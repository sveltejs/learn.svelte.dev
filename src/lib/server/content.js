import { posixify } from '$lib/utils.js';
import fs from 'node:fs';
import path from 'node:path';
import glob from 'tiny-glob/sync.js';
import { transform } from './markdown.js';

const text_files = new Set([
	'.svelte',
	'.txt',
	'.json',
	'.js',
	'.ts',
	'.css',
	'.svg',
	'.html',
	'.md',
	'.env'
]);

const excluded = new Set(['.DS_Store', '.gitkeep', '.svelte-kit', 'package-lock.json']);

/** @param {string} file */
function json(file) {
	return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

/** @param {string} dir */
function is_valid(dir) {
	return /^\d{2}-/.test(dir);
}

/**
 * @param {string} part
 * @param {string} chapter
 * @param {string} dir
 */
function exists_readme(part, chapter, dir) {
	return fs.existsSync(`content/tutorial/${part}/${chapter}/${dir}/README.md`);
}

/**
 * @returns {import('$lib/types').PartStub[]}
 */
export function get_index() {
	const parts = fs.readdirSync('content/tutorial').filter(is_valid).map(posixify);

	return parts.map((part) => {
		const chapters = fs.readdirSync(`content/tutorial/${part}`).filter(is_valid).map(posixify);

		return {
			slug: part,
			title: json(`content/tutorial/${part}/meta.json`).title,
			chapters: chapters.map((chapter) => {
				const exercises = fs
					.readdirSync(`content/tutorial/${part}/${chapter}`)
					.filter((dir) => is_valid(dir) && exists_readme(part, chapter, dir))
					.map(posixify);

				return {
					slug: chapter,
					title: json(`content/tutorial/${part}/${chapter}/meta.json`).title,
					exercises: exercises.map((exercise) => {
						const dir = `content/tutorial/${part}/${chapter}/${exercise}`;

						const text = fs.readFileSync(`${dir}/README.md`, 'utf-8');
						const { frontmatter } = extract_frontmatter(text, dir);
						const { title } = frontmatter;

						return {
							slug: exercise.slice(3),
							title
						};
					})
				};
			})
		};
	});
}

/**
 * @param {string} slug
 * @returns {import('$lib/types').Exercise | undefined}
 */
export function get_exercise(slug) {
	const exercises = glob('[0-9][0-9]-*/[0-9][0-9]-*/[0-9][0-9]-*/README.md', {
		cwd: 'content/tutorial'
	}).map(posixify);

	/** @type {string[]} */
	const chain = [];

	for (let i = 0; i < exercises.length; i += 1) {
		const file = exercises[i];
		const [part_dir, chapter_dir, exercise_dir] = file.split('/');
		const exercise_slug = exercise_dir.slice(3);

		const dir = `content/tutorial/${part_dir}/${chapter_dir}/${exercise_dir}`;

		if (fs.existsSync(`${dir}/app-a`)) {
			chain.length = 0;
			chain.push(`${dir}/app-a`);
		}

		if (exercise_slug === slug) {
			const a = {
				...walk('content/tutorial/common', {
					exclude: ['node_modules', 'static/tutorial', 'static/svelte-logo-mask.svg']
				}),
				...walk(`content/tutorial/${part_dir}/common`)
			};

			for (const dir of chain) {
				Object.assign(a, walk(dir));
			}

			const b = walk(`${dir}/app-b`);
			const has_solution = Object.keys(b).length > 0;

			// ensure no duplicate content
			for (const key in b) {
				if (!a[key]) continue;
				if (b[key].type !== 'file') continue;

				const a_ = /** @type {import('$lib/types').FileStub} */ (a[key]);
				const b_ = /** @type {import('$lib/types').FileStub} */ (b[key]);

				if (a_.contents === b_.contents) {
					throw new Error(`duplicate file: ${exercise_slug} ${key}`);
				}
			}

			const part_meta = json(`content/tutorial/${part_dir}/meta.json`);
			const chapter_meta = json(`content/tutorial/${part_dir}/${chapter_dir}/meta.json`);

			const exercise_meta_file = `content/tutorial/${part_dir}/${chapter_dir}/${exercise_dir}/meta.json`;
			const exercise_meta = fs.existsSync(exercise_meta_file) ? json(exercise_meta_file) : {};

			const scope = chapter_meta.scope ?? part_meta.scope;

			const text = fs.readFileSync(`${dir}/README.md`, 'utf-8');
			const { frontmatter, markdown } = extract_frontmatter(text, dir);
			const { title, path = '/', focus } = frontmatter;

			const prev_slug = exercises[i - 1]?.split('/')[2].slice(3);
			const prev = prev_slug
				? {
						slug: prev_slug
				  }
				: null;

			let next = null;

			const next_exercise = exercises[i + 1];

			if (next_exercise) {
				/** @type {string} */
				let title;

				const dirs = next_exercise.split('/');
				if (dirs[0] !== part_dir) {
					title = json(`content/tutorial/${dirs[0]}/meta.json`).title;
				} else if (dirs[1] !== chapter_dir) {
					title = json(`content/tutorial/${dirs[0]}/${dirs[1]}/meta.json`).title;
				} else {
					title = extract_frontmatter(
						fs.readFileSync(`content/tutorial/${next_exercise}`, 'utf-8'),
						next_exercise
					).frontmatter.title;
				}

				next = {
					slug: next_exercise.split('/')[2].slice(3),
					title
				};
			}

			const editing_constraints = {
				create: new Set(exercise_meta.editing_constraints?.create ?? []),
				remove: new Set(exercise_meta.editing_constraints?.remove ?? [])
			};

			const solution = { ...a };

			for (const stub of Object.values(b)) {
				if (stub.type === 'file' && stub.contents.startsWith('__delete')) {
					// remove file
					editing_constraints.remove.add(stub.name);
					delete solution[stub.name];
				} else if (stub.name.endsWith('/__delete')) {
					// remove directory
					const parent = stub.name.slice(0, stub.name.lastIndexOf('/'));
					editing_constraints.remove.add(parent);
					delete solution[parent];
					for (const k in solution) {
						if (k.startsWith(parent + '/')) {
							delete solution[k];
						}
					}
				} else {
					if (!solution[stub.name]) {
						editing_constraints.create.add(stub.name);
					}
					solution[stub.name] = stub;
				}
			}

			// ensure every code block for an exercise with multiple files has a `/// file:` annotation
			const filtered = Object.values(solution).filter((item) => {
				return item.type === 'file' && item.name.startsWith(scope.prefix);
			});

			if (filtered.length > 0) {
				for (const match of markdown.matchAll(/```[a-z]+\n([\s\S]+?)\n```/g)) {
					const content = match[1];
					if (!content.includes('/// file') && !content.includes('/// no-file')) {
						throw new Error(`Code block lacks a \`/// file: ...\` annotation: ${dir}/README.md`);
					}
				}
			}

			const all_files = { ...a, ...solution };
			const filenames = new Set(
				Object.keys(all_files)
					.filter(
						(filename) => filename.startsWith(scope.prefix) && all_files[filename].type === 'file'
					)
					.map((filename) => filename.slice(scope.prefix.length))
			);

			return {
				part: {
					slug: part_dir,
					title: `Part ${part_dir.slice(1, 2)}`
				},
				chapter: {
					slug: chapter_dir,
					title: chapter_meta.title
				},
				scope,
				focus: focus ?? chapter_meta.focus ?? part_meta.focus,
				title,
				path,
				slug: exercise_slug,
				prev,
				next,
				dir,
				editing_constraints,
				html: transform(markdown, {
					codespan: (text) =>
						filenames.size > 1 && filenames.has(text)
							? `<code data-file="${scope.prefix + text}">${text}</code>`
							: `<code>${text}</code>`
				}),
				a,
				b: solution,
				has_solution
			};
		}

		chain.push(`${dir}/app-b`);
	}
}

/**
 * @param {string} markdown
 * @param {string} dir
 */
function extract_frontmatter(markdown, dir) {
	const match = /---\n([^]+?)\n---\n([^]+)/.exec(markdown);
	if (!match) {
		throw new Error(`bad markdown for ${dir}`);
	}

	/** @type {Record<string, string>} */
	const frontmatter = {};

	for (const line of match[1].split('\n')) {
		const index = line.indexOf(':');
		if (index !== -1) {
			frontmatter[line.slice(0, index).trim()] = line.slice(index + 1).trim();
		}
	}

	return { frontmatter, markdown: match[2] };
}

/**
 * Get a list of all files in a directory
 * @param {string} cwd - the directory to walk
 * @param {{
 *   exclude?: string[]
 * }} options
 */
function walk(cwd, options = {}) {
	/** @type {Record<string, import('$lib/types').FileStub | import('$lib/types').DirectoryStub>} */
	const result = {};

	if (!fs.existsSync(cwd)) return result;

	/**
	 * @param {string} dir
	 * @param {number} depth
	 */
	function walk_dir(dir, depth) {
		const files = fs.readdirSync(path.join(cwd, dir)).map(posixify);

		for (const basename of files) {
			if (excluded.has(basename)) continue;

			const name = dir + basename;

			if (options.exclude?.some((exclude) => posixify(name).endsWith(exclude))) continue;

			const resolved = path.join(cwd, name);
			const stats = fs.statSync(resolved);

			if (stats.isDirectory()) {
				result[name] = {
					type: 'directory',
					name,
					basename
				};

				walk_dir(name + '/', depth + 1);
			} else {
				const text = text_files.has(path.extname(name) || path.basename(name));
				const contents = fs.readFileSync(resolved, text ? 'utf-8' : 'base64');

				result[name] = {
					type: 'file',
					name,
					basename,
					text,
					contents
				};
			}
		}
	}

	return walk_dir('/', 1), result;
}
