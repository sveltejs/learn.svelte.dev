<script>
	import Eliza from 'elizabot';
	import {
		beforeUpdate,
		afterUpdate
	} from 'svelte';

	let div;
	let autoscroll = false;

	beforeUpdate(() => {
		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
	});

	afterUpdate(() => {
		if (autoscroll) {
			div.scrollTo(0, div.scrollHeight);
		}
	});

	const eliza = new Eliza();
	const pause = (ms) => new Promise((fulfil) => setTimeout(fulfil, ms));

	const typing = { author: 'eliza', text: '...' };

	let comments = [
		{ author: 'eliza', text: eliza.getInitial() }
	];

	async function handleKeydown(event) {
		if (event.key === 'Enter' && event.target.value) {
			event.target.value = '';

			const comment = {
				author: 'user',
				text: event.target.value
			};

			const reply = {
				author: 'eliza',
				text: eliza.transform(comment.text)
			};

			comments = [...comments, comment];

			await pause(200 * (1 + Math.random()));
			comments = [...comments, typing];

			await pause(500 * (1 + Math.random()));
			comments = [...comments, reply].filter(comment => comment !== typing);
		}
	}
</script>

<div class="chat">
	<h1>Eliza</h1>

	<div class="scrollable" bind:this={div}>
		{#each comments as comment}
			<article class={comment.author}>
				<span>{comment.text}</span>
			</article>
		{/each}
	</div>

	<input on:keydown={handleKeydown} />
</div>

<style>
	.chat {
		display: flex;
		flex-direction: column;
		height: 100%;
		max-width: 320px;
	}

	.scrollable {
		flex: 1 1 auto;
		border-top: 1px solid #eee;
		margin: 0 0 0.5em 0;
		overflow-y: auto;
	}

	article {
		margin: 0.5em 0;
	}

	.user {
		text-align: right;
	}

	span {
		padding: 0.5em 1em;
		display: inline-block;
	}

	.eliza span {
		background-color: #eee;
		border-radius: 1em 1em 1em 0;
		color: black;
	}

	.user span {
		background-color: #0074d9;
		color: white;
		border-radius: 1em 1em 0 1em;
		word-break: break-all;
	}
</style>
