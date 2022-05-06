import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

export function get_index() {
	const groups = [];

	for (const group of fs.readdirSync('content')) {
		if (!/^\d{2}-/.test(group)) continue;

		const meta_file = `content/${group}/meta.json`;
		const meta = JSON.parse(fs.readFileSync(meta_file, 'utf-8'));

		const sections = [];

		for (const section of fs.readdirSync(`content/${group}`)) {
			const dir = `content/${group}/${section}`;
			if (!fs.statSync(dir).isDirectory()) continue;

			const text = fs.readFileSync(`${dir}/text.md`, 'utf-8');
			const { frontmatter, markdown } = extract_frontmatter(text);

			sections.push({
				slug: section.slice(3),
				title: frontmatter.title,
				markdown,
				dir
			});
		}

		groups.push({
			title: meta.title,
			sections
		});
	}

	return groups;
}

/** @param {string} slug */
export function get_section(slug) {
	const common = walk('content/common');

	for (const group of get_index()) {
		for (const section of group.sections) {
			if (section.slug !== slug) continue;

			const a = {
				...common,
				...walk(`${section.dir}/app-a`)
			};

			const b = walk(`${section.dir}/app-b`);

			return {
				group: group.title,
				title: section.title,
				html: marked(section.markdown), // TODO syntax highlighting
				a: Object.values(a),
				b: Object.values(b)
			};
		}
	}
}

/** @param {string} markdown */
function extract_frontmatter(markdown) {
	const match = /---\n([^]+?)\n---\n([^]+)/.exec(markdown);
	if (!match) {
		throw new Error('bad markdown');
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
 */
export function walk(cwd) {
	/** @type {Record<string, import('$lib/types').File | import('$lib/types').Directory>} */
	const result = {};

	if (!fs.existsSync(cwd)) return result;

	/** @param {string} dir */
	function walk_dir(dir) {
		const files = fs.readdirSync(path.join(cwd, dir));

		for (const file of files) {
			const name = path.join(dir, file);
			const resolved = path.join(cwd, name);

			const stats = fs.statSync(resolved);

			if (stats.isDirectory()) {
				result[name] = {
					type: 'directory',
					name
				};

				walk_dir(name);
			} else {
				result[name] = {
					type: 'file',
					name,
					contents: fs.readFileSync(resolved, 'utf-8')
				};
			}
		}
	}

	return walk_dir(''), result;
}
