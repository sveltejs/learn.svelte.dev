<script>
	import { page } from '$app/stores';

	// we don't want to use <svelte:window bind:online> here, because we only care about the online
	// state when the page first loads
	let online = typeof navigator !== 'undefined' ? navigator.onLine : true;
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<div class="container">
	{#if $page.status === 404}
		<h1>Không tìm thấy!</h1>
	{:else if online}
		<h1>Yikes!</h1>

		{#if $page.error?.message}
			<p class="error">{$page.status}: {$page.error.message}</p>
		{/if}

		<p>Thử reload lại trang.</p>

		<p>
			Nếu lỗi vẫn cứ tiếp tục, hãy báo cáo lỗi tại <a href="https://svelte.dev/chat">kênh chat của Svelte Vietnam</a>
			, hoặc báo cáo lỗi tại 
			<a href="https://github.com/sveltevietnam/learn.svelte.dev/issues">GitHub</a>.
		</p>
	{:else}
		<h1>Có vẻ như bạn đang ngoại tuyến.</h1>

		<p>Hãy reload trang sau khi bạn đã kết nối internet.</p>
	{/if}
</div>

<style>
	.container {
		padding: 4rem;
	}

	h1,
	p {
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		font-weight: 300;
		margin: 0;
		margin-bottom: 0.5em;
	}

	p {
		margin: 1em auto;
	}

	.error {
		background-color: #da106e;
		color: white;
		padding: 12px 16px;
		font: 600 16px/1.7 var(--sk-font);
		border-radius: 2px;
	}
</style>
