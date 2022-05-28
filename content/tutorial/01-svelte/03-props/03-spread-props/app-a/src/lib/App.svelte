<script>
	import PackageInfo from './PackageInfo.svelte';

	const pkg = {
		name: 'svelte',
		version: 3,
		speed: 'blazing',
		website: 'https://svelte.dev'
	};
</script>

<PackageInfo
	name={pkg.name}
	version={pkg.version}
	speed={pkg.speed}
	website={pkg.website}
/>
