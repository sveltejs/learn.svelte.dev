<script>
	import { Icon, Nav, NavItem, Shell } from '@sveltejs/site-kit/components';
	import '@sveltejs/site-kit/styles/index.css';
	import '../app.css';
</script>

<Shell>
	<Nav slot="top-nav" logo="/svelte-logo.svg">
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

			<NavItem external="https://svelte.dev/chat" title="Discord Chat">
				<span slot="small">Discord</span>
				<Icon name="message-square" />
			</NavItem>

			<NavItem external="https://github.com/sveltejs/svelte" title="GitHub Repo">
				<span slot="small">GitHub</span>
				<Icon name="github" />
			</NavItem>
		</svelte:fragment>
	</Nav>

	<slot />
</Shell>

<style>
	:global(body) {
		margin: 0;
		width: 100%;
		min-height: 100dvh;
	}

	.large {
		display: none;
	}

	@media (min-width: 800px) {
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
