import zipped from './common.zip?url';
import unzip from './unzip.cjs?url';

async function load() {
	const result = await Promise.all([
		fetch(zipped).then((r) => r.arrayBuffer()),
		fetch(unzip).then((r) => r.text())
	]);

	return {
		zipped: result[0],
		unzip: result[1]
	};
}

export const ready = load();
