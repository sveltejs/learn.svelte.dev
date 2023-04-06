<script>
	import tippy from 'tippy.js';
	import 'tippy.js/dist/tippy.css';
	import 'tippy.js/themes/light.css';

	function tooltip(node, params) {
		const tooltip = tippy(node, params);

		return {
			update: (params) => {
				tooltip.setProps(params);
			},
			destroy: () => {
				tooltip.destroy();
			}
		};
	}
</script>

<button use:tooltip={{ content: 'Hello!', theme: 'light' }}>
	Hover me
</button>