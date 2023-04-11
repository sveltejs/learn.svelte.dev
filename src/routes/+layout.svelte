<script>
	import { Icon, Nav, NavItem, Shell } from '@sveltejs/site-kit/components';
	import '@sveltejs/site-kit/styles/index.css';
	import '../app.css';
</script>

<Shell>
	<Nav slot="top-nav">
		<svelte:fragment slot="home">
			<strong>learn</strong>.svelte.dev
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
