<script>
	let numbers = [1, 2, 3, 4];

	function addNumber() {
		numbers.push(numbers.length + 1);
	}

	$: sum = numbers.reduce((total, currentNumber) => total + currentNumber, 0);
</script>

<button on:click={addNumber}>
	Thêm một số
</button>

<p>{numbers.join(' + ')} = {sum}</p>
