<script>
	export let name;
	export let version;
	export let speed;
	export let website;

	$: href = `https://www.npmjs.com/package/${name}`;
</script>

<p>
	The <code>{name}</code> package is {speed} fast. Download version {version}
	from
	<a {href}>npm</a>
	and <a href={website}>learn more here</a>
</p>

<style>
	code {
		font-family: Menlo;
		padding: 0.1em 0.2em;
		border-radius: 0.2em;
	}
</style>
