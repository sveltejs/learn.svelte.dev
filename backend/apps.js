import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import * as ports from 'port-authority';
import { broadcast, ready } from './ws';

/**
 * @typedef {{
 *   process: import('child_process').ChildProcess,
 *   filenames: string[]
 * }} App */

fs.rmSync('.apps', { recursive: true, force: true });
fs.mkdirSync('.apps', { recursive: true });

// poor man's HMR, pending https://github.com/vitejs/vite/issues/7887
// @ts-expect-error
if (globalThis.__apps) {
	globalThis.__apps.forEach((app) => {
		app.process.kill();
	});
}

const require = createRequire(import.meta.url);
const vite_pkg_file = require.resolve('vite/package.json');
const vite_pkg = JSON.parse(fs.readFileSync(vite_pkg_file, 'utf-8'));
const vite = path.resolve(vite_pkg_file, '..', vite_pkg.bin['vite']);

/** @type {Map<string, App>} */
const apps = new Map();
globalThis.__apps = apps;

const hooks_src = `/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event);

	response.headers.set('cross-origin-opener-policy', 'same-origin');
	response.headers.set('cross-origin-embedder-policy', 'require-corp');
	response.headers.set('cross-origin-resource-policy', 'cross-origin');

	return response;
}`;

/**
 * @param {{
 *   files: import('$lib/types').FileStub[]
 * }} options
 */
export async function create({ files }) {
	const id = String(Date.now());
	const filenames = write_files(id, files);

	// TODO this enables embedding on cross-origin sites, which is
	// necessary for the JSNation talk, but will currently break if an app
	// already has a src/hooks.server.js file (though it could be worked
	// around easily enough if necessary)
	if (!files.find((stub) => stub.name === '/src/hooks.server.js')) {
		fs.writeFileSync(`.apps/${id}/src/hooks.server.js`, hooks_src);
	}

	const port = await ports.find(3001);

	apps.set(id, {
		process: launch(id, String(port)),
		filenames
	});

	await ports.waitUntilBusy(port);

	await ready;

	return {
		id,
		port
	};
}

/**
 * @param {{
 *   id: string;
 *   files: import('$lib/types').FileStub[]
 * }} options
 */
export function clear({ id, files }) {
	const app = apps.get(id);

	if (!app) {
		throw new Error(`app ${id} does not exist`);
	}

	const dir = `.apps/${id}`;
	const old_filenames = new Set(app.filenames);

	/** @type {string[]} */
	const filenames = [];

	for (const file of files) {
		if (file.type === 'file') {
			filenames.push(file.name);
			old_filenames.delete(file.name);
		}
	}

	for (const file of old_filenames) {
		if (fs.existsSync(dir + file)) {
			fs.unlinkSync(dir + file);
		}
	}

	app.filenames = filenames;
}

/**
 * @param {{
 *   id: string;
 *   files: import('$lib/types').FileStub[]
 * }} options
 */
export function update({ id, files }) {
	if (!apps.has(id)) {
		throw new Error(`app ${id} does not exist`);
	}

	write_files(id, files);
}

/**
 * @param {{ id: string }} options
 */
export function destroy({ id }) {
	const dir = `.apps/${id}`;

	fs.rmSync(dir, { recursive: true, force: true });

	apps.get(id)?.process.kill();
	apps.delete(id);
}

/**
 * @param {string} id
 * @param {string} port
 */
function launch(id, port) {
	const cwd = `.apps/${id}`;

	const process = spawn('node', [vite, 'dev', '--port', port], {
		cwd
	});

	process.stdout.on('data', (data) => {
		broadcast({ id, data: data.toString(), type: 'stdout' });
	});

	process.stderr.on('data', (data) => {
		broadcast({ id, data: data.toString(), type: 'stderr' });
	});

	return process;
}

/**
 *
 * @param {string} file
 * @param {string | Buffer} contents
 */
function write_if_changed(file, contents) {
	if (typeof contents === 'string' && fs.existsSync(file)) {
		const existing = fs.readFileSync(file, 'utf-8');
		if (contents === existing) return;
	}

	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(file, contents);
}

/**
 *
 * @param {string} id
 * @param {import('$lib/types').FileStub[]} files
 */
function write_files(id, files) {
	const dir = `.apps/${id}`;

	/** @type {string[]} */
	const filenames = [];

	for (const file of files) {
		if (file.type === 'file') {
			filenames.push(file.name);

			const dest = `${dir}/${file.name}`;
			let content = file.text ? file.contents : Buffer.from(file.contents, 'base64');

			if (file.name === '/src/app.html' && typeof content === 'string') {
				// TODO handle case where config.kit.files.template is different
				content = content.replace(
					'</head>',
					'<script type="module" src="/src/__client.js"></script></head>'
				);
			}

			write_if_changed(dest, content);
		}
	}

	return filenames;
}
