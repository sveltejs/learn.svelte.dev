import zipped from './common.zip?url';
import boot from './boot.cjs?url';

async function load() {
	const result = await Promise.all([
		fetch(zipped).then((r) => r.arrayBuffer()),
		fetch(boot).then((r) => r.text())
	]);

	return {
		zipped: result[0],
		boot: result[1]
	};
}

export const ready = load();
