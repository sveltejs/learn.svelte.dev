<script>
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import '@fontsource/roboto-mono';
	import { Icon, Shell } from '@sveltejs/site-kit/components';
	import { Nav, Separator } from '@sveltejs/site-kit/nav';
	import { Search, SearchBox } from '@sveltejs/site-kit/search';
	import '@sveltejs/site-kit/styles/index.css';
	import '../app.css';

	import { PUBLIC_SVELTE_SITE_URL, PUBLIC_KIT_SITE_URL } from '$env/static/public';

	export let data;
</script>

<Shell>
	<Nav title="" links={data.links} slot="top-nav">
		<svelte:fragment slot="home-large">
			<strong>learn</strong>.svelte.dev
		</svelte:fragment>

		<svelte:fragment slot="home-small">
			<strong>learn</strong>
		</svelte:fragment>

		<svelte:fragment slot="search">
			{#if $page.url.pathname !== '/search'}
				<Search label="Recherche" />
			{/if}
		</svelte:fragment>

		<svelte:fragment slot="external-links">
			<a href={PUBLIC_SVELTE_SITE_URL}>Svelte</a>

			<a href={PUBLIC_KIT_SITE_URL}>SvelteKit</a>

			<Separator />

			<a href="{PUBLIC_SVELTE_SITE_URL}/chat" title="Discord Chat">
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
	<SearchBox placeholder="Recherche">
		<svelte:fragment slot="search-description">
			Les résultats se mettent à jour quand vous écrivez
		</svelte:fragment>
		<svelte:fragment slot="idle" let:has_recent_searches>
			{has_recent_searches ? 'Recherches récentes' : 'Aucune recherche récente'}
		</svelte:fragment>
		<svelte:fragment slot="no-results">Aucun résultat</svelte:fragment>
	</SearchBox>
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

	:global(.text .vo a) {
		color: var(--sk-text-1);
		box-shadow: inset 0 -1px 0 0 var(--sk-text-4);
		transition: color 0.2s ease-in-out;
	}

	:global(.text .vo a:hover) {
		color: var(--sk-text-3);
		box-shadow: inset 0 -1px 0 0 var(--sk-text-4);
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
