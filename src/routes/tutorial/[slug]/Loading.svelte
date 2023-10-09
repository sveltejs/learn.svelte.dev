<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { Icon } from '@sveltejs/site-kit/components';

	/** @type {boolean} */
	export let initial;

	/** @type {Error | null} */
	export let error;

	/** @type {number} */
	export let progress;

	/** @type {string} */
	export let status;

	$: is_svelte = /Part (1|2)/.test($page.data.exercise.part.title);
</script>

<div class="loading">
	{#if error}
		<div class="error">
			<div>
				<h2>Yikes!</h2>
				{#if error.message === 'Your browser does not support all necessary features'}
					<p>
						Ứng dụng này yêu cầu những chức năng hiện đại từ nền tảng web. Hãy sử dụng trình duyệt khác ngoài Safari.
					</p>
				{:else if /firefox/i.test(navigator.userAgent)}
					<p>
						Mình không thể chạy ứng dụng. Hãy chắc chắn rằng 
						<a
							target="_blank"
							rel="noreferrer"
							href="https://support.mozilla.org/en-US/kb/third-party-cookies-firefox-tracking-protection"
						>
							cookie bên thứ ba
						</a> được kích hoạt cho trang web này, và tắt Trình chống theo dõi nâng cao.
					</p>
					<p>
						If you have 'Delete cookies and site data when Firefox is closed' enabled in
						<code>about:preferences#privacy</code>, make sure <code>learn.svelte.dev</code> is included
						as an exception.
						Nếu bạn có bật 'Xoá cookie và dữ liệu trang web khi Firefox đóng' trong <code>about:preferences#privacy</code>, hãy chắc chắn rằng <code>learn.svelte.dev</code> được thêm vào danh sách ngoại lệ.
					</p>
				{:else if /chrome/i.test(navigator.userAgent) && !/edg/i.test(navigator.userAgent)}
					<p>
						Mình không thể chạy ứng dụng. Hãy chắc chắn rằng cookie bên thứ ba được kích hoạt cho trang web này —
						bấm vào biểu tượng 
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							style="width: 1em; height: 1em; position: relative; top: 0.1em; margin: 0 0.2em; transform: scale(1.2)"
						>
							<title>con mắt</title>
							<path
								fill="#666"
								d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z"
							/>
						</svg>
						trong thanh URL hoặc vào 
						<code>chrome://settings/cookies</code> và thêm <code>learn.svelte.dev</code> vào 'Trang web luôn được sử dụng cookie'.
					</p>
				{:else}
					<p>
						Mình không thể chạy ứng dụng. Hãy chắc chắn rằng cookie bên thứ ba được kích hoạt cho trang web này.
					</p>
				{/if}

				{#if is_svelte}
					<a href="https://svelte.dev/tutorial/{$page.data.exercise.slug}">
						Đi tới trang hướng dẫn cũ của Svelte (tiếng Anh) <Icon name="arrow-right" />
					</a>
				{/if}
			</div>

			<small>{error.message}</small>
		</div>
	{:else}
		<svg width="107" height="128" viewBox="0 0 107 128">
			<path
				d="M94.1566,22.8189c-10.4-14.8851-30.94-19.2971-45.7914-9.8348L22.2825,29.6078A29.9234,29.9234,0,0,0,8.7639,49.6506a31.5136,31.5136,0,0,0,3.1076,20.2318A30.0061,30.0061,0,0,0,7.3953,81.0653a31.8886,31.8886,0,0,0,5.4473,24.1157c10.4022,14.8865,30.9423,19.2966,45.7914,9.8348L84.7167,98.3921A29.9177,29.9177,0,0,0,98.2353,78.3493,31.5263,31.5263,0,0,0,95.13,58.117a30,30,0,0,0,4.4743-11.1824,31.88,31.88,0,0,0-5.4473-24.1157"
				style="fill: var(--faded)"
			/>
			<path
				d="M45.8171,106.5815A20.7182,20.7182,0,0,1,23.58,98.3389a19.1739,19.1739,0,0,1-3.2766-14.5025,18.1886,18.1886,0,0,1,.6233-2.4357l.4912-1.4978,1.3363.9815a33.6443,33.6443,0,0,0,10.203,5.0978l.9694.2941-.0893.9675a5.8474,5.8474,0,0,0,1.052,3.8781,6.2389,6.2389,0,0,0,6.6952,2.485,5.7449,5.7449,0,0,0,1.6021-.7041L69.27,76.281a5.4306,5.4306,0,0,0,2.4506-3.631,5.7948,5.7948,0,0,0-.9875-4.3712,6.2436,6.2436,0,0,0-6.6978-2.4864,5.7427,5.7427,0,0,0-1.6.7036l-9.9532,6.3449a19.0329,19.0329,0,0,1-5.2965,2.3259,20.7181,20.7181,0,0,1-22.2368-8.2427,19.1725,19.1725,0,0,1-3.2766-14.5024,17.9885,17.9885,0,0,1,8.13-12.0513L55.8833,23.7472a19.0038,19.0038,0,0,1,5.3-2.3287A20.7182,20.7182,0,0,1,83.42,29.6611a19.1739,19.1739,0,0,1,3.2766,14.5025,18.4,18.4,0,0,1-.6233,2.4357l-.4912,1.4978-1.3356-.98a33.6175,33.6175,0,0,0-10.2037-5.1l-.9694-.2942.0893-.9675a5.8588,5.8588,0,0,0-1.052-3.878,6.2389,6.2389,0,0,0-6.6952-2.485,5.7449,5.7449,0,0,0-1.6021.7041L37.73,51.719a5.4218,5.4218,0,0,0-2.4487,3.63,5.7862,5.7862,0,0,0,.9856,4.3717,6.2437,6.2437,0,0,0,6.6978,2.4864,5.7652,5.7652,0,0,0,1.602-.7041l9.9519-6.3425a18.978,18.978,0,0,1,5.2959-2.3278,20.7181,20.7181,0,0,1,22.2368,8.2427,19.1725,19.1725,0,0,1,3.2766,14.5024,17.9977,17.9977,0,0,1-8.13,12.0532L51.1167,104.2528a19.0038,19.0038,0,0,1-5.3,2.3287"
				style="fill: var(--cutout)"
			/>
		</svg>

		{#if initial}
			<div class="progress-container">
				<div class="progress" style="width: {progress * 100}%;" />
			</div>
			<span>{status}</span>
		{/if}
	{/if}
</div>

<style>
	.loading {
		--faded: #eee;
		--progress: #ccc;
		--cutout: #fff;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		padding: 2rem;
		display: flex;
		gap: 1rem;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: var(--sk-back-2);
		user-select: none;
	}

	.progress-container {
		width: 10rem;
		height: 0.5rem;
		background: var(--faded);
		border-radius: 0.25rem;
	}

	.progress {
		height: 100%;
		background: var(--progress);
		border-radius: 0.25rem;
		transition: width 0.2s ease-out;
	}

	.error {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	h2 {
		font-size: var(--sk-text-xl);
	}

	p {
		margin: 0 0 1em 0;
	}

	small {
		font-size: var(--sk-text-xs);
		color: var(--sk-text-3);
		text-transform: uppercase;
	}

	span {
		color: var(--sk-text-3);
	}

	svg {
		width: 10rem;
		height: 10rem;
	}

	@media (prefers-color-scheme: dark) {
		.loading {
			--faded: #444;
			--progress: #555;
			--cutout: var(--sk-back-2);
		}
	}
</style>
