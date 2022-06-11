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

const delimiter_substitutes = {
	'+++': '             ',
	'---': '           ',
	':::': '         '
};

/**
 * @param {string} content
 * @param {string} classname
 */
function highlight_spans(content, classname) {
	return `<span class="${classname}">${content}</span>`;
	// return content.replace(/<span class="([^"]+)"/g, (_, classnames) => {
	// 	return `<span class="${classname} ${classnames}"`;
	// });
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
				.replace(/([+:-]{3})/g, (_, delimiter) => {
					return delimiter_substitutes[delimiter];
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

			return html
				.replace(/ {13}([^ ][^]+?) {13}/g, (_, content) => {
					return highlight_spans(content, 'highlight add');
				})
				.replace(/ {11}([^ ][^]+?) {11}/g, (_, content) => {
					return highlight_spans(content, 'highlight remove');
				})
				.replace(/ {9}([^ ][^]+?) {9}/g, (_, content) => {
					return highlight_spans(content, 'highlight');
				});
		}
	}
});

/** @param {string} markdown */
export function transform(markdown) {
	return marked(markdown);
}
