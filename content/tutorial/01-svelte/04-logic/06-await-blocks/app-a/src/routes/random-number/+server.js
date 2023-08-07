export async function GET(req) {
	const query = req.url.searchParams;
	let min = query.get('min') || '0';
	let max = query.get('max') || '100';
	min = +min;
	max = +max;

	// simule un long temps de chargement
	await new Promise((res) => setTimeout(res, 1000));

	// échoue parfois
	if (Math.random() < 0.333) {
		return new Response(`Échec de génération du nombre aléatoire. Merci de réessayer`, {
			status: 400,
			headers: { 'Access-Control-Allow-Origin': '*' }
		});
	}

	const num = min + Math.round(Math.random() * (max - min));
	return new Response(String(num), {
		headers: { 'Access-Control-Allow-Origin': '*' }
	});
}