<div class="card">
	<header>
		<slot name="telephone">
			<i>(telephone)</i>
		</slot>
		
		<slot name="company">
			<i>(company name)</i>
		</slot>
	</header>

	<slot>
		<i>(name)</i>
	</slot>
		
	<footer>
		<slot name="address">
			<i>(address)</i>
		</slot>
	</footer>
</div>

<style>
	@font-face {
		src: url('/Garamond Classico SC Regular.woff2') format('woff2');
		font-family: 'Silian Rail';
		font-style: normal;
		font-weight: 400;
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: min(2vw, 3.5vh, 1.5rem);
		font-family: 'Silian Rail';
		width: 24em;
		aspect-ratio: 3.5 / 2.0;
		background: url(./paper.svg) no-repeat 50% 50%;
		background-size: cover;
		border-radius: 2px;
		filter: drop-shadow(0.1em 0.1em 0.1em rgba(0, 0, 0, 0.2));
		padding: 1.5em 1em 1em 1em;
		font-variant: small-caps;
		text-shadow: -1px -1px 2px rgba(0, 0, 0, 0.2), 1px 1px 2px white;
		color: hsl(50, 20%, 35%);
		line-height: 1.2;
	}

	header, footer {
		width: 100%;
		display: flex;
		flex: 1;
	}

	header {
		justify-content: space-between;
	}

	footer {
		font-size: 0.7em;
		justify-content: center;
		align-items: end;
	}
</style>
