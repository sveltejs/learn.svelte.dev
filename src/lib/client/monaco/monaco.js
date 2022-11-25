import { browser, dev } from '$app/environment';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

/** @type {import('monaco-editor')} */
let monaco;

if (browser) {
	if (dev && !/chrome/i.test(navigator.userAgent)) {
		throw new Error(
			'The code editor requires Chrome during development, as it uses module workers'
		);
	}

	// @ts-expect-error
	self.MonacoEnvironment = {
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

	monaco = await import('monaco-editor');
}

/**
 * file extension -> monaco language
 * @type {Record<string, string>}
 * */
const types = {
	js: 'javascript',
	ts: 'typescript',
	svelte: 'html' // TODO
};

/**
 * URL -> model
 * @type {Map<string, import('monaco-editor').editor.ITextModel>}
 * */
const models = new Map();

let notify_adapter = true;

/**
 *
 * @param {import('$lib/types').Stub[]} stubs
 * @param {() => import('$lib/types').Adapter} adapter
 * @param {boolean} [notify]
 */
function update_files(stubs, adapter, notify = true) {
	notify_adapter = notify;
	for (const stub of stubs) {
		if (stub.type === 'directory') {
			continue;
		}

		const model = models.get(stub.name);

		if (model) {
			const value = model.getValue();

			if (stub.contents !== value) {
				model.pushEditOperations(
					[],
					[
						{
							range: model.getFullModelRange(),
							text: stub.contents
						}
					],
					() => null
				);
			}
		} else {
			create_file(stub, adapter);
		}
	}

	for (const [name, model] of models) {
		if (!stubs.some((stub) => stub.name === name)) {
			model.dispose();
			models.delete(name);
		}
	}
	notify = true;
}

/**
 * @param {import('$lib/types').FileStub} stub
 * @param {() => import('$lib/types').Adapter} adapter
 */
function create_file(stub, adapter) {
	// deep-copy stub so we can mutate it and not create a memory leak
	stub = JSON.parse(JSON.stringify(stub));

	const type = /** @type {string} */ (stub.basename.split('.').pop());

	const model = monaco.editor.createModel(
		stub.contents,
		types[type] || type,
		new monaco.Uri().with({ path: stub.name })
	);

	model.updateOptions({ tabSize: 2 });

	model.onDidChangeContent(() => {
		const contents = model.getValue();

		if (notify_adapter) {
			stub.contents = contents;
			adapter()?.update([stub]);
		}
	});

	models.set(stub.name, model);
}

/** @param {string} name */
function get_model(name) {
	return models.get(name);
}

export { monaco, get_model, create_file, update_files };
