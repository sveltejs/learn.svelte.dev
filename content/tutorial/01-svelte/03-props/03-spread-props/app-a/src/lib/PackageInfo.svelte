<script>
	export let name;
	export let version;
	export let speed;
	export let website;

	$: href = `https://www.npmjs.com/package/${name}`;
</script>

<p>
	Cái gói <code>{name}</code> này {speed}. Tải phiên bản {version} từ 
	<a {href}>npm</a> và <a href={website}>tìm hiểu thêm tại đây</a>.
</p>
