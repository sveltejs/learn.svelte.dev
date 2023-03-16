/** @param {string} name */
export function get_depth(name) {
	return name.split('/').length - 1;
}

/** @type {Record<string, string>} */
const chars = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

/** @param {string} html */
export function escape_html(html) {
	return html.replace(/[&<>]/g, (c) => chars[c]);
}