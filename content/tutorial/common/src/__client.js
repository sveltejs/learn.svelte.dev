function post(data) {
	parent.postMessage(data, '*');
}

function update_path(path) {
	post({ type: 'path', path });
}

function ping() {
	post({ type: 'ping' });
}

function pause() {
	post({ type: 'ping-pause' });
}

// Hack into the alert that's used in some tutorials and send a message prior to the alert,
// else the parent thinks we lost contact and wrongfully reloads the page.
// The drawback is that alert is no longer blocking, but no tutorial relies on this.
const alert = window.alert;
window.alert = (message) => {
	pause();

	setTimeout(() => {
		alert(message);
	});
};

let can_focus = false;

window.addEventListener('pointerdown', (e) => can_focus = true);
window.addEventListener('pointerup', (e) => can_focus = false);
window.addEventListener('keydown', (e) => can_focus = true);
window.addEventListener('keyup', (e) => can_focus = false);

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
	post({ type: 'iframe_took_focus' });
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
			} else {
				update_path(url.pathname + url.search + url.hash);
			}
		}
		node = node.parent;
	}
});

window.addEventListener('visibilitychange', () => {
	if (document.visibilityState === 'visible') {
		ping();
	} else {
		pause();
	}
});

let previous_href = location.href;

const url_observer = new MutationObserver(() => {
	if (location.href !== previous_href) {
		previous_href = location.href;
		update_path(location.pathname + location.search + location.hash);
	}
});

url_observer.observe(document, {
	subtree: true,
	childList: true,
	attributes: true
});

setInterval(ping, 100);
ping();

if (import.meta.hot) {
	import.meta.hot.on('vite:beforeUpdate', (event) => {
		post({ type: 'hmr', data: event.updates });
	});

	import.meta.hot.on('svelte:warnings', (data) => {
		post({ type: 'warnings', data });
	});
}
