import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import * as ports from 'port-authority';
import { broadcast, ready } from './_ws';

/**
 * @typedef {{
 *   process: import('child_process').ChildProcess,
 *   files: string[]
 * }} App */

fs.rmSync('.apps', { recursive: true, force: true });
fs.mkdirSync('.apps', { recursive: true });

// poor man's HMR, pending https://github.com/vitejs/vite/issues/7887
if (globalThis.__apps) {
	globalThis.__apps.forEach((app) => {
		app.process.kill();
	});
}

const require = createRequire(import.meta.url);
const sveltekit_pkg_file = require.resolve('@sveltejs/kit/package.json');
const sveltekit_pkg = JSON.parse(fs.readFileSync(sveltekit_pkg_file, 'utf-8'));
const sveltekit = path.resolve(sveltekit_pkg_file, '..', sveltekit_pkg.bin['svelte-kit']);

/** @type {Map<string, App>} */
const apps = new Map();
globalThis.__apps = apps;

export async function create() {
	const id = String(Date.now());

	fs.mkdirSync(`.apps/${id}`);

	await ready;

	return {
		id,
		port: await ports.find(3001)
	};
}

/**
 * @param {{
 *   id: string;
 *   port: string;
 *   files: import('$lib/types').FileStub[]
 * }} options
 */
export function update({ id, port, files }) {
	const app = apps.get(id);

	const old_files = new Set(app ? app.files : []);

	/** @type {string[]} */
	const new_files = [];

	for (const file of files) {
		if (file.type === 'file') {
			new_files.push(file.name);
			old_files.delete(file.name);

			const dest = `.apps/${id}/${file.name}`;
			write_if_changed(dest, file.text ? file.contents : Buffer.from(file.contents, 'base64'));
		}
	}

	// TODO this is buggy
	// for (const file of old_files) {
	// 	if (fs.existsSync(`${dir}/${file}`)) {
	// 		fs.unlinkSync(`${dir}/${file}`);
	// 	}
	// }

	if (app) {
		app.files = new_files;
	} else {
		apps.set(id, {
			process: launch(id, port),
			files: new_files
		});
	}
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

	const process = spawn(`${sveltekit}`, ['dev', '--port', port], {
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
