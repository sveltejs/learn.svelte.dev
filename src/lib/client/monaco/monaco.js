import { browser } from '$app/env';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

/** @type {import('monaco-editor')} */
let monaco;

if (browser) {
	monaco = await import('monaco-editor');

	// @ts-expect-error
	window.monacoEnvironment = {
		/**
		 * @param {string} _moduleId
		 * @param {string} label
		 */
		getWorker: function (_moduleId, label) {
			switch (label) {
				case 'json':
					return new jsonWorker();
				case 'css':
				case 'scss':
				case 'less':
					return new cssWorker();
				case 'html':
					return new htmlWorker();
				case 'javascript':
				case 'typescript':
					return new tsWorker();
				default:
					return new editorWorker();
			}
		}
	};
}

export { monaco };
