/** @param {string} name */
export function get_depth(name) {
	return name.split('/').length - 1;
}
