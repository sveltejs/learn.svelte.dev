<script>
	import '@sveltejs/site-kit/styles/index.css';
	import '../app.css';
	import { page, navigating } from '$app/stores';
	import { Icon, Icons, Nav, NavItem, SkipLink } from '@sveltejs/site-kit';
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
</script>

<Icons />

{#if $navigating && $navigating.to}
	<PreloadingIndicator />
{/if}

<SkipLink href="#main" />

<Nav {page} logo="/svelte-logo.svg">
	<svelte:fragment slot="nav-center">
		<strong class="large">Work in progress. Here be dragons!</strong>
		<!-- <NavItem href="/tutorial">Tutorial</NavItem>
		<NavItem href="/docs">Docs</NavItem>
		<NavItem href="/examples">Examples</NavItem>
		<NavItem href="/repl">REPL</NavItem>
		<NavItem href="/blog">Blog</NavItem>
		<NavItem href="/faq">FAQ</NavItem> -->
	</svelte:fragment>

	<svelte:fragment slot="nav-right">
		<NavItem external="https://kit.svelte.dev">SvelteKit</NavItem>

		<NavItem external="/chat" title="Discord Chat">
			<span class="small">Discord</span>
			<span class="large"><Icon name="message-square" /></span>
		</NavItem>

		<NavItem external="https://github.com/sveltejs/svelte" title="GitHub Repo">
			<span class="small">GitHub</span>
			<span class="large"><Icon name="github" /></span>
		</NavItem>
	</svelte:fragment>
</Nav>

<main id="main"><slot /></main>

<style>
	:global(body) {
		margin: 0;
		width: 100%;
		min-height: 100vh;
	}

	main {
		width: 100%;
		height: calc(100vh - var(--nav-h));
		position: relative;
		top: var(--nav-h);
	}

	.large {
		display: none;
	}

	@media (min-width: 800px) {
		.small {
			display: none;
		}

		.large {
			display: inline;
		}

		strong.large {
			height: 100%;
			display: flex;
			align-items: center;
			color: var(--sk-text-2);
			text-transform: uppercase;
			font-size: 1.2rem;
			opacity: 1;
			white-space: nowrap;
		}
	}
</style>
