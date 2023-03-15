// Hack into the alert that's used in some tutorials and send a message prior to the alert,
// else the parent thinks we lost contact and wrongfully reloads the page.
// The drawback is that alert is no longer blocking, but no tutorial relies on this.
const alert = window.alert;
window.alert = (message) => {
	parent.postMessage(
		{
			type: 'ping-pause'
		},
		'*'
	);
	setTimeout(() => {
		alert(message);
	});
};

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

/**
 * The iframe sometimes takes focus control in ways we can't prevent
 * while the editor is focussed. Refocus the editor in these cases.
 */
window.addEventListener('focusin', (e) => {
	/**
	 * This condition would only be `true` if the iframe took focus when loaded,
	 * and `false` in other cases, for example:
	 * - navigation inside the iframe - for example, if you click a link inside
	 *   the iframe, the `focusin` event will be fired twice, the first time
	 *   `e.target` will be its anchor, the second time `e.target` will be body,
	 *   and `e.relatedTarget` will be its anchor (if `csr = false` in only the
	 *   first `focusin` event will be fired)
	 * - an element such as input gets focus (either from inside or outside the
	 *   iframe) - for example, if an input inside the iframe gets focus,
	 *   `e.target` will be the input.
	 */
	if (
		e.target.tagName === 'BODY' &&
		!e.target.contains(e.relatedTarget)
	) {
		parent.postMessage(
			{
				type: 'iframe_took_focus'
			},
			'*'
		);
	}
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

setInterval(ping, 100);
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
