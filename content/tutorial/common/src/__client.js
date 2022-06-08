function ping() {
	top.postMessage(
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
		top.postMessage(
			{
				type: 'hmr',
				data: event.updates
			},
			'*'
		);
	});
}
