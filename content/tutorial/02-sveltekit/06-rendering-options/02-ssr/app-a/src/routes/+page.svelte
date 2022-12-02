<script>
	// this will fail when running on the server, because the document global isn't available there
	const focused = document.activeElement?.tagName;
</script>

<p>
	The initially focused element is: {focused}
</p>
