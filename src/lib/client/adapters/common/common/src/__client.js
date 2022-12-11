window.addEventListener('message', async (e) => {
	if (e.data.type === 'fetch') {
		const names = e.data.names;

		const transformed = await Promise.all(
			names.map(async (name) => {
				const res = await fetch(name);
				return {
					name,
					code: await res.text()
				};
			})
		);

		const css_files = [];

		for (const { name, code } of transformed) {
			if (name.endsWith('.svelte') && code.includes('svelte&type=style&lang.css')) {
				css_files.push(name + '?svelte&type=style&lang.css');
			}
		}

		if (css_files.length > 0) {
			const css_transformed = await Promise.all(
				css_files.map(async (name) => {
					const res = await fetch(name);
					return {
						name,
						code: await res.text()
					};
				})
			);

			transformed.push(...css_transformed);
		}

		parent.postMessage(
			{
				type: 'fetch-result',
				data: transformed
			},
			'*'
		);
	}
});

function ping() {
	parent.postMessage(
		{
			type: 'ping',
			data: {
				path: location.pathname + location.search + location.hash
			}
		},
		'*'
	);
}

setInterval(ping, 200);
ping();

if (import.meta.hot) {
	import.meta.hot.on('vite:beforeUpdate', (event) => {
		parent.postMessage(
			{
				type: 'hmr',
				data: event.updates
			},
			'*'
		);
	});
}
