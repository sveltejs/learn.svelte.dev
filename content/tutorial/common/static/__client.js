let path = '';

setInterval(() => {
	if (path !== (path = location.pathname + location.search + location.hash)) {
		top.postMessage(
			{
				type: 'path',
				data: { path }
			},
			'*'
		);
	}
}, 200);
