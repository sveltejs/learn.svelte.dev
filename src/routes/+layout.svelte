<script>
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import '@fontsource/roboto-mono';
	import { Icon, Shell } from '@sveltejs/site-kit/components';
	import { Nav, Separator } from '@sveltejs/site-kit/nav';
	import { Search, SearchBox } from '@sveltejs/site-kit/search';
	import '@sveltejs/site-kit/styles/index.css';
	import '../app.css';

	export let data;
</script>

<Shell>
	<Nav title="" links={data.links} slot="top-nav">
		<svelte:fragment slot="home-large">
			<strong>learn</strong>.sveltevietnam.dev
		</svelte:fragment>

		<svelte:fragment slot="home-small">
			<strong>learn</strong>
		</svelte:fragment>

		<svelte:fragment slot="search">
			{#if $page.url.pathname !== '/search'}
				<Search />
			{/if}
		</svelte:fragment>

		<svelte:fragment slot="external-links">
			<a href="https://svelte.dev">Svelte</a>

			<a href="https://kit.svelte.dev">SvelteKit</a>

			<Separator />

			<a href="https://svelte.dev/chat" title="Discord Chat">
				<span class="small">Discord</span>
				<span class="large"><Icon name="discord" /></span>
			</a>

			<a href="https://github.com/sveltejs/learn.svelte.dev" title="GitHub Repo">
				<span class="small">GitHub</span>
				<span class="large"><Icon name="github" /></span>
			</a>
		</svelte:fragment>
	</Nav>

	<slot />
</Shell>

{#if browser}
	<SearchBox />
{/if}

<style>
	:global(body) {
		margin: 0;
		width: 100%;
		min-height: 100dvh;
	}

	span {
		display: none;
	}

	@media (min-width: 800px) {
		span {
			height: 100%;
			display: flex;
			align-items: center;
			color: var(--sk-text-2);
			font-size: var(--sk-text-s);
			opacity: 1;
			white-space: nowrap;
		}
	}
</style>
