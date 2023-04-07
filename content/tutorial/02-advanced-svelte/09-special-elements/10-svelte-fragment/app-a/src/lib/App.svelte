<script>
	import Board from './Board.svelte';

	let squares = Array(9).fill('');
	let next = 'x';

	function getLine(squares) {
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6]
		];

		for (const line of lines) {
			const [a, b, c] = line;
			if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				return line;
			}
		}

		return null;
	}

	$: winningLine = getLine(squares);
</script>

<div class="container">
	<Board size={3}>
		<svelte:fragment slot="game">
			{#each squares as square, i}
				<button
					class="square"
					class:winning={winningLine?.includes(i)}
					disabled={square}
					on:click={() => {
						squares[i] = next;
						next = next === 'x' ? 'o' : 'x';
					}}
				>
					{square}
				</button>
			{/each}
		</svelte:fragment>
	</Board>

	<button on:click={() => {
		squares = Array(9).fill('');
		next = 'x';
	}}>
		Reset
	</button>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 1em;
		align-items: center;
		justify-content: center;
		width: min(calc(100vmin - 2em), 20em);
		height: 100%;
		margin: 0 auto;
	}

	.square, .square:disabled {
		background: white;
		border-radius: 0;
		color: #222;
		opacity: 1;
		font-size: 2em;
	}

	.winning {
		font-weight: bold;
	}

	.container:has(.winning) .square:not(.winning) {
		color: #ccc;
	}
</style>