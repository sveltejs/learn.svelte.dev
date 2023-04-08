<script>
	import Eliza from 'elizabot';
	import {
		beforeUpdate,
		afterUpdate
	} from 'svelte';

	let div;

	beforeUpdate(() => {
		// determine whether we should auto-scroll
		// once the DOM is updated...
	});

	afterUpdate(() => {
		// ...the DOM is now in sync with the data
	});

	const eliza = new Eliza();
	const pause = (ms) => new Promise((fulfil) => setTimeout(fulfil, ms));

	const typing = { author: 'eliza', text: '...' };

	let comments = [];

	async function handleKeydown(event) {
		if (event.key === 'Enter' && event.target.value) {
			const comment = {
				author: 'user',
				text: event.target.value
			};

			const reply = {
				author: 'eliza',
				text: eliza.transform(comment.text)
			};

			event.target.value = '';
			comments = [...comments, comment];

			await pause(200 * (1 + Math.random()));
			comments = [...comments, typing];

			await pause(500 * (1 + Math.random()));
			comments = [...comments, reply].filter(comment => comment !== typing);
		}
	}
</script>

<div class="container">
	<div class="phone">
		<div class="chat" bind:this={div}>
			<header>
				<h1>Eliza</h1>

				<article class="eliza">
					<span>{eliza.getInitial()}</span>
				</article>
			</header>

			{#each comments as comment}
				<article class={comment.author}>
					<span>{comment.text}</span>
				</article>
			{/each}
		</div>

		<input on:keydown={handleKeydown} />
	</div>
</div>

<style>
	.container {
		display: grid;
		place-items: center;
		height: 100%;
	}

	.phone {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	header {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 4em 0 0 0;
		box-sizing: border-box;
	}

	h1 {
		flex: 1;
		font-size: 1.4em;
		text-align: center;
	}

	.chat {
		height: 0;
		flex: 1 1 auto;
		padding: 0 1em;
		overflow-y: auto;
		scroll-behavior: smooth;
	}

	article {
		margin: 0 0 0.5em 0;
	}

	.user {
		text-align: right;
	}

	span {
		padding: 0.5em 1em;
		display: inline-block;
	}

	.eliza span {
		background-color: var(--bg-1);
		border-radius: 1em 1em 1em 0;
		color: var(--fg-1);
	}

	.user span {
		background-color: #0074d9;
		color: white;
		border-radius: 1em 1em 0 1em;
		word-break: break-all;
	}

	input {
		margin: 0.5em 1em 1em 1em;
	}

	@media (min-width: 400px) {
		.phone {
			background: var(--bg-2);
			position: relative;
			font-size: min(2.5vh, 1rem);
			width: auto;
			height: 36em;
			aspect-ratio: 9 / 16;
			border: 0.2em solid #222;
			border-radius: 1em;
			box-sizing: border-box;
			filter: drop-shadow(1px 1px 0px #222) drop-shadow(2px 2px 0px #222) drop-shadow(3px 3px 0px #222)
		}

		.phone::after {
			position: absolute;
			content: '';
			background: #222;
			width: 60%;
			height: 1em;
			left: 20%;
			top: 0;
			border-radius: 0 0 0.5em 0.5em
		}
	}

	@media (prefers-reduced-motion) {
		.chat {
			scroll-behavior: auto;
		}
	}
</style>
