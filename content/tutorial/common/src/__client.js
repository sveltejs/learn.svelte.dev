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
}

/** 
 * The iframe sometimes takes focus control in ways we can't prevent
 * while the editor is focussed. Refocus the editor in these cases.
 */
window.addEventListener('focusin', (e) => {
	if (e.target.tagName === 'BODY') {
		parent.postMessage(
			{
				type: 'focus_on_editor'
			},
			'*'
		);
	}
});
