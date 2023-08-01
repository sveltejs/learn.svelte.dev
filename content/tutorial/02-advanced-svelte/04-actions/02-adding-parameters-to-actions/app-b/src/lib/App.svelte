<script>
	import tippy from 'tippy.js';
	import 'tippy.js/dist/tippy.css';
	import 'tippy.js/themes/material.css';

	let content = 'Salut !';

	function tooltip(node, options) {
		const tooltip = tippy(node, options);

		return {
			update(options) {
				tooltip.setProps(options);
			},
			destroy() {
				tooltip.destroy();
			}
		};
	}
</script>

<input bind:value={content} />

<button use:tooltip={{ content, theme: 'material' }}>
	Survolez-moi
</button>