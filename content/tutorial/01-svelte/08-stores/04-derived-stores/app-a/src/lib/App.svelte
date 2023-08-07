<script>
	import { time, elapsed } from './stores.js';

	const formatter = new Intl.DateTimeFormat(
		'en',
		{
			hour12: true,
			hour: 'numeric',
			minute: '2-digit',
			second: '2-digit'
		}
	);
</script>

<h1>Il est {formatter.format($time)}</h1>

<p>
	Cette page a été ouverte
	{$elapsed}
	{$elapsed === 1 ? 'seconde' : 'secondes'}
</p>
