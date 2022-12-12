import fs from 'fs';
import esbuild from 'esbuild';
import AdmZip from 'adm-zip';
import glob from 'tiny-glob/sync.js';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const cwd = 'content/tutorial/common';

if (!fs.existsSync(`${cwd}/node_modules`)) {
	execSync('npm ci', { cwd });
}

const zip = new AdmZip();

// we selectively exclude certain files to minimise the bundle size.
// this is a bit ropey, but it works
const ignored_basenames = ['.DS_Store', 'LICENSE'];
const ignored_extensions = ['.d.ts', '.map'];
const ignored_directories = ['.svelte-kit', 'node_modules/.bin', 'node_modules/rollup/dist/shared'];

const ignored_files = new Set(['node_modules/svelte/compiler.js']);

for (const file of glob('**', { cwd, filesOnly: true, dot: true }).map((file) =>
	file.replaceAll('\\', '/')
)) {
	if (ignored_extensions.find((ext) => file.endsWith(ext))) continue;
	if (ignored_basenames.find((basename) => file.endsWith('/' + basename))) continue;
	if (ignored_directories.find((dir) => file.startsWith(dir + '/'))) continue;

	if (ignored_files.has(file)) {
		ignored_files.delete(file);
		continue;
	}

	// esbuild is a special case
	if (file.startsWith('node_modules/esbuild-wasm/')) {
		zip.addFile(
			file.replace('node_modules/esbuild-wasm', 'node_modules/esbuild'),
			fs.readFileSync(`${cwd}/${file}`)
		);
		continue;
	} else if (file.startsWith('node_modules/esbuild') || file.startsWith('node_modules/@esbuild')) {
		continue;
	}

	zip.addFile(file, fs.readFileSync(`${cwd}/${file}`));
}

if (ignored_files.size > 0) {
	throw new Error(`expected to find ${Array.from(ignored_files).join(', ')}`);
}

const out = zip.toBuffer();

fs.writeFileSync(`src/lib/client/adapters/common/common.zip`, out);

// bundle adm-zip so we can use it in the webcontainer
esbuild.buildSync({
	entryPoints: [fileURLToPath(new URL('./unzip.js', import.meta.url))],
	bundle: true,
	platform: 'node',
	minify: true,
	outfile: 'src/lib/client/adapters/common/unzip.cjs',
	format: 'cjs'
});
