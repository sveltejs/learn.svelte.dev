import PrismJS from 'prismjs';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-diff.js';
import 'prismjs/components/prism-typescript.js';
import 'prism-svelte';
import { marked } from 'marked';

const languages = {
	bash: 'bash',
	env: 'bash',
	html: 'markup',
	svelte: 'svelte',
	js: 'javascript',
	css: 'css',
	diff: 'diff',
	ts: 'typescript',
	'': ''
};

/** @type {Record<string, string>} */
const chars = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

/** @param {string} html */
function escape(html) {
	return html.replace(/[&<>]/g, (c) => chars[c]);
}

marked.use({
	renderer: {
		code: (source, language, current) => {
			/** @type {Record<string, string>} */
			const options = {};

			let html = '';

			source = source
				.replace(/\/\/\/ (.+?): (.+)\n/gm, (match, key, value) => {
					options[key] = value;
					return '';
				})
				.replace(/^([\-\+])?((?:    )+)/gm, (match, prefix = '', spaces) => {
					if (prefix && language !== 'diff') return match;

					// for no good reason at all, marked replaces tabs with spaces
					let tabs = '';
					for (let i = 0; i < spaces.length; i += 4) {
						tabs += '  ';
					}
					return prefix + tabs;
				})
				.replace(/\*\\\//g, '*/');

			if (language === 'diff') {
				const lines = source.split('\n').map((content) => {
					let type = null;
					if (/^[\+\-]/.test(content)) {
						type = content[0] === '+' ? 'inserted' : 'deleted';
						content = content.slice(1);
					}

					return {
						type,
						content: escape(content)
					};
				});

				html = `<div class="code-block"><pre class="language-diff"><code>${lines
					.map((line) => {
						if (line.type) return `<span class="${line.type}">${line.content}\n</span>`;
						return line.content + '\n';
					})
					.join('')}</code></pre></div>`;
			} else {
				const plang = languages[language];
				const highlighted = plang
					? PrismJS.highlight(source, PrismJS.languages[plang], language)
					: escape(source);

				html = `<div class="code-block">${
					options.file ? `<h5>${options.file}</h5>` : ''
				}<pre class='language-${plang}'><code>${highlighted}</code></pre></div>`;
			}

			return html.replace(
				/^(\s+)<span class="token comment">([\s\S]+?)<\/span>\n/gm,
				(match, intro_whitespace, content) => {
					// we use some CSS trickery to make comments break onto multiple lines while preserving indentation
					const lines = (intro_whitespace + content).split('\n');
					return lines
						.map((line) => {
							const match = /^(\s*)(.*)/.exec(line);
							const indent = (match[1] ?? '').replace(/\t/g, '  ').length;

							return `<span class="token comment wrapped" style="--indent: ${indent}ch">${
								line ?? ''
							}</span>`;
						})
						.join('');
				}
			);
		}
	}
});

/** @param {string} markdown */
export function transform(markdown) {
	return marked(markdown);
}
