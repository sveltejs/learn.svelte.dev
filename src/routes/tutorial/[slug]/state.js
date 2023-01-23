/**
 * The iframe sometimes takes focus control in ways we can't prevent
 * while the editor is focused. Refocus the editor in these cases.
 * This boolean tracks whether or not the editor should be refocused.
 */
export let preserve_editor_focus = false;

/** @param {boolean} value */
export function set_preserve_editor_focus(value) {
	preserve_editor_focus = value;
}
