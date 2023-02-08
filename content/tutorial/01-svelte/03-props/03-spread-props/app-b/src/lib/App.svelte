<script>
	import PackageInfo from './PackageInfo.svelte';

	const pkg = {
		name: 'svelte',
		version: 3,
		speed: 'blazingly',
		website: 'https://svelte.dev'
	};
</script>

<PackageInfo {...pkg} />
