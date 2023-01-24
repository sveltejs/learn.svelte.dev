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
	// Belts and braces against malicious messages
	if (e.data.type === 'goto' && e.data.path?.startsWith('/')) {
		// SvelteKit's client.js will pick this up
		const a = document.createElement('a');
		a.href = e.data.path;
		document.firstElementChild.append(a);
		a.click();
		a.remove();
	}
});

history.pushState = function (state, title, url) {
	// Don't create a new history entry for better back/forward navigation in the parent window
	history.replaceState(state, title, url);
};

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
