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
			if (
				name.endsWith('.svelte') &&
				code.includes('svelte&type=style&lang.css')
			) {
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

let can_focus = false;

window.addEventListener('pointerdown', (e) => {
	can_focus = true;
});

window.addEventListener('pointerup', (e) => {
	can_focus = false;
});

window.addEventListener('keydown', (e) => {
	can_focus = true;
});

window.addEventListener('keyup', (e) => {
	can_focus = false;
});

/**
 * The iframe sometimes takes focus control in ways we can't prevent
 * while the editor is focused. Refocus the editor in these cases.
 */
window.addEventListener('focusin', (e) => {
	// if focusin happened as a result of a mouse/keyboard event, allow it
	if (can_focus) return;

	// if `e.target` is the `<body>` and there's a `relatedTarget`,
	// assume the focusin was the result of a user navigation — allow it
	if (e.target.tagName === 'BODY' && e.relatedTarget) return;

	// otherwise, broadcast an event that causes the editor to reclaim focus
	parent.postMessage(
		{
			type: 'iframe_took_focus'
		},
		'*'
	);
});

window.addEventListener('click', (e) => {
	let node = e.target;
	while (node) {
		if (node.nodeName === 'A') {
			const href = node.href;
			const url = new URL(href);

			if (url.origin !== location.origin) {
				e.preventDefault();
				window.open(url, '_blank');
			}
		}
		node = node.parent;
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

let pre_url = location.href;
const url_observer = new MutationObserver(() => {
	if (location.href !== pre_url) {
		pre_url = location.href;
		ping();
	}
});
url_observer.observe(document, { subtree: true, childList: true, attributes: true });

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

	import.meta.hot.on('svelte:warnings', (data) => {
		parent.postMessage(
			{
				type: 'warnings',
				data
			},
			'*'
		);
	});
}
