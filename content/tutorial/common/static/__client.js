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
