/**
 * this file is based on [dataProvider.ts from sveltejs/language-tools](https://github.com/sveltejs/language-tools/blob/master/packages/language-server/src/plugins/html/dataProvider.ts)
 */

export const globalEvents = [
	{ name: 'on:abort' },
	{ name: 'on:animationcancel' },
	{ name: 'on:animationend' },
	{ name: 'on:animationiteration' },
	{ name: 'on:animationstart' },
	{ name: 'on:auxclick' },
	{ name: 'on:beforeinput' },
	{ name: 'on:blur' },
	{ name: 'on:cancel' },
	{ name: 'on:canplay' },
	{ name: 'on:canplaythrough' },
	{ name: 'on:change' },
	{ name: 'on:click' },
	{ name: 'on:close' },
	{ name: 'on:contextmenu' },
	{ name: 'on:copy' },
	{ name: 'on:cuechange' },
	{ name: 'on:cut' },
	{ name: 'on:dblclick' },
	{ name: 'on:drag' },
	{ name: 'on:dragend' },
	{ name: 'on:dragenter' },
	{ name: 'on:dragleave' },
	{ name: 'on:dragover' },
	{ name: 'on:dragstart' },
	{ name: 'on:drop' },
	{ name: 'on:durationchange' },
	{ name: 'on:emptied' },
	{ name: 'on:ended' },
	{ name: 'on:error' },
	{ name: 'on:focus' },
	{ name: 'on:formdata' },
	{ name: 'on:gotpointercapture' },
	{ name: 'on:input' },
	{ name: 'on:invalid' },
	{ name: 'on:keydown' },
	{ name: 'on:keypress' },
	{ name: 'on:keyup' },
	{ name: 'on:load' },
	{ name: 'on:loadeddata' },
	{ name: 'on:loadedmetadata' },
	{ name: 'on:loadstart' },
	{ name: 'on:lostpointercapture' },
	{ name: 'on:mousedown' },
	{ name: 'on:mouseenter' },
	{ name: 'on:mouseleave' },
	{ name: 'on:mousemove' },
	{ name: 'on:mouseout' },
	{ name: 'on:mouseover' },
	{ name: 'on:mouseup' },
	{ name: 'on:paste' },
	{ name: 'on:pause' },
	{ name: 'on:play' },
	{ name: 'on:playing' },
	{ name: 'on:pointercancel' },
	{ name: 'on:pointerdown' },
	{ name: 'on:pointerenter' },
	{ name: 'on:pointerleave' },
	{ name: 'on:pointermove' },
	{ name: 'on:pointerout' },
	{ name: 'on:pointerover' },
	{ name: 'on:pointerup' },
	{ name: 'on:progress' },
	{ name: 'on:ratechange' },
	{ name: 'on:reset' },
	{ name: 'on:resize' },
	{ name: 'on:scroll' },
	{ name: 'on:securitypolicyviolation' },
	{ name: 'on:seeked' },
	{ name: 'on:seeking' },
	{ name: 'on:select' },
	{ name: 'on:selectionchange' },
	{ name: 'on:selectstart' },
	{ name: 'on:slotchange' },
	{ name: 'on:stalled' },
	{ name: 'on:submit' },
	{ name: 'on:suspend' },
	{ name: 'on:timeupdate' },
	{ name: 'on:toggle' },
	{ name: 'on:touchcancel' },
	{ name: 'on:touchend' },
	{ name: 'on:touchmove' },
	{ name: 'on:touchstart' },
	{ name: 'on:transitioncancel' },
	{ name: 'on:transitionend' },
	{ name: 'on:transitionrun' },
	{ name: 'on:transitionstart' },
	{ name: 'on:volumechange' },
	{ name: 'on:waiting' },
	{ name: 'on:webkitanimationend' },
	{ name: 'on:webkitanimationiteration' },
	{ name: 'on:webkitanimationstart' },
	{ name: 'on:webkittransitionend' },
	{ name: 'on:wheel' }
];

/** @type {{ name: string, description?: string }[]} */
export const svelteEvents = [
	...globalEvents,
	{
		name: 'on:introstart',
		description: 'Available when element has transition'
	},
	{
		name: 'on:introend',
		description: 'Available when element has transition'
	},
	{
		name: 'on:outrostart',
		description: 'Available when element has transition'
	},
	{
		name: 'on:outroend',
		description: 'Available when element has transition'
	}
];

export const svelteAttributes = [
	{
		name: 'bind:innerHTML',
		description: 'Available when contenteditable=true'
	},
	{
		name: 'bind:textContent',
		description: 'Available when contenteditable=true'
	},
	{
		name: 'bind:innerText',
		description: 'Available when contenteditable=true'
	},
	{
		name: 'bind:clientWidth',
		description: 'Available for block level elements. (read-only)'
	},
	{
		name: 'bind:clientHeight',
		description: 'Available for block level elements. (read-only)'
	},
	{
		name: 'bind:offsetWidth',
		description: 'Available for block level elements. (read-only)'
	},
	{
		name: 'bind:offsetHeight',
		description: 'Available for block level elements. (read-only)'
	},
	{
		name: 'bind:this',
		description:
			'To get a reference to a DOM node, use bind:this. If used on a component, gets a reference to that component instance.'
	}
];

export const sveltekitAttributes = [
	{
		name: 'data-sveltekit-keepfocus',
		description:
			'SvelteKit-specific attribute. Currently focused element will retain focus after navigation. Otherwise, focus will be reset to the body.',
		valueSet: 'v',
		values: [{ name: 'off' }]
	},
	{
		name: 'data-sveltekit-noscroll',
		description: 'SvelteKit-specific attribute. Will prevent scrolling after the link is clicked.',
		valueSet: 'v',
		values: [{ name: 'off' }]
	},
	{
		name: 'data-sveltekit-preload-code',
		description:
			"SvelteKit-specific attribute. Will cause SvelteKit to run the page's load function as soon as the user hovers over the link (on a desktop) or touches it (on mobile), rather than waiting for the click event to trigger navigation.",
		valueSet: 'v',
		values: [
			{ name: 'eager' },
			{ name: 'viewport' },
			{ name: 'hover' },
			{ name: 'tap' },
			{ name: 'off' }
		]
	},
	{
		name: 'data-sveltekit-preload-data',
		description:
			"SvelteKit-specific attribute. Will cause SvelteKit to run the page's load function as soon as the user hovers over the link (on a desktop) or touches it (on mobile), rather than waiting for the click event to trigger navigation.",
		valueSet: 'v',
		values: [{ name: 'hover' }, { name: 'tap' }, { name: 'off' }]
	},
	{
		name: 'data-sveltekit-reload',
		description:
			'SvelteKit-specific attribute. Will cause SvelteKit to do a normal browser navigation which results in a full page reload.',
		valueSet: 'v',
		values: [{ name: 'off' }]
	},
	{
		name: 'data-sveltekit-replacestate',
		description:
			'SvelteKit-specific attribute. Will replace the current `history` entry rather than creating a new one with `pushState` when the link is clicked.',
		valueSet: 'v',
		values: [{ name: 'off' }]
	}
];

export const svelteTags = [
	{
		name: 'svelte:self',
		description:
			'Allows a component to include itself, recursively.\n\nIt cannot appear at the top level of your markup; it must be inside an if or each block to prevent an infinite loop.',
		attributes: []
	},
	{
		name: 'svelte:component',
		description:
			'Renders a component dynamically, using the component constructor specified as the this property. When the property changes, the component is destroyed and recreated.\n\nIf this is falsy, no component is rendered.',
		attributes: [
			{
				name: 'this',
				description:
					'Component to render.\n\nWhen this property changes, the component is destroyed and recreated.\nIf this is falsy, no component is rendered.'
			}
		]
	},
	{
		name: 'svelte:element',
		description:
			'Renders a DOM element dynamically, using the string as the this property. When the property changes, the element is destroyed and recreated.\n\nIf this is falsy, no element is rendered.',
		attributes: [
			{
				name: 'this',
				description:
					'DOM element to render.\n\nWhen this property changes, the element is destroyed and recreated.\nIf this is falsy, no element is rendered.'
			}
		]
	},
	{
		name: 'svelte:window',
		description:
			'Allows you to add event listeners to the window object without worrying about removing them when the component is destroyed, or checking for the existence of window when server-side rendering.',
		attributes: [
			{
				name: 'bind:innerWidth',
				description: 'Bind to the inner width of the window. (read-only)'
			},
			{
				name: 'bind:innerHeight',
				description: 'Bind to the inner height of the window. (read-only)'
			},
			{
				name: 'bind:outerWidth',
				description: 'Bind to the outer width of the window. (read-only)'
			},
			{
				name: 'bind:outerHeight',
				description: 'Bind to the outer height of the window. (read-only)'
			},
			{
				name: 'bind:scrollX',
				description: 'Bind to the scroll x position of the window.'
			},
			{
				name: 'bind:scrollY',
				description: 'Bind to the scroll y position of the window.'
			},
			{
				name: 'bind:online',
				description: 'An alias for window.navigator.onLine'
			},
			// window events
			{ name: 'on:afterprint' },
			{ name: 'on:beforeprint' },
			{ name: 'on:beforeunload' },
			{ name: 'on:gamepadconnected' },
			{ name: 'on:gamepaddisconnected' },
			{ name: 'on:hashchange' },
			{ name: 'on:languagechange' },
			{ name: 'on:message' },
			{ name: 'on:messageerror' },
			{ name: 'on:offline' },
			{ name: 'on:online' },
			{ name: 'on:pagehide' },
			{ name: 'on:pageshow' },
			{ name: 'on:popstate' },
			{ name: 'on:rejectionhandled' },
			{ name: 'on:storage' },
			{ name: 'on:unhandledrejection' },
			{ name: 'on:unload' }
		]
	},
	{
		name: 'svelte:document',
		description:
			"As with <svelte:window>, this element allows you to add listeners to events on document, such as visibilitychange, which don't fire on window.",
		attributes: [
			// document events
			{ name: 'on:fullscreenchange' },
			{ name: 'on:fullscreenerror' },
			{ name: 'on:pointerlockchange' },
			{ name: 'on:pointerlockerror' },
			{ name: 'on:readystatechange' },
			{ name: 'on:visibilitychange' }
		]
	},
	{
		name: 'svelte:body',
		description:
			"As with <svelte:window>, this element allows you to add listeners to events on document.body, such as mouseenter and mouseleave which don't fire on window.",
		attributes: []
	},
	{
		name: 'svelte:head',
		description:
			'This element makes it possible to insert elements into document.head. During server-side rendering, head content exposed separately to the main html content.',
		attributes: []
	},
	{
		name: 'svelte:options',
		description: 'Provides a place to specify per-component compiler options',
		attributes: [
			{
				name: 'immutable',
				description:
					'If true, tells the compiler that you promise not to mutate any objects. This allows it to be less conservative about checking whether values have changed.',
				values: [
					{
						name: '{true}',
						description:
							'You never use mutable data, so the compiler can do simple referential equality checks to determine if values have changed'
					},
					{
						name: '{false}',
						description:
							'The default. Svelte will be more conservative about whether or not mutable objects have changed'
					}
				]
			},
			{
				name: 'accessors',
				description:
					"If true, getters and setters will be created for the component's props. If false, they will only be created for readonly exported values (i.e. those declared with const, class and function). If compiling with customElement: true this option defaults to true.",
				values: [
					{
						name: '{true}',
						description: "Adds getters and setters for the component's props"
					},
					{
						name: '{false}',
						description: 'The default.'
					}
				]
			},
			{
				name: 'namespace',
				description: 'The namespace where this component will be used, most commonly "svg"'
			},
			{
				name: 'tag',
				description: 'The name to use when compiling this component as a custom element'
			}
		]
	},
	{
		name: 'svelte:fragment',
		description:
			'This element is useful if you want to assign a component to a named slot without creating a wrapper DOM element.',
		attributes: [
			{
				name: 'slot',
				description: 'The name of the named slot that should be targeted.'
			}
		]
	},
	{
		name: 'slot',
		description:
			'Components can have child content, in the same way that elements can.\n\nThe content is exposed in the child component using the <slot> element, which can contain fallback content that is rendered if no children are provided.',
		attributes: [
			{
				name: 'name',
				description:
					'Named slots allow consumers to target specific areas. They can also have fallback content.'
			}
		]
	}
];

const mediaAttributes = [
	{
		name: 'bind:duration',
		description: 'The total duration of the video, in seconds. (readonly)'
	},
	{
		name: 'bind:buffered',
		description: 'An array of {start, end} objects. (readonly)'
	},
	{
		name: 'bind:seekable',
		description: 'An array of {start, end} objects. (readonly)'
	},
	{
		name: 'bind:played',
		description: 'An array of {start, end} objects. (readonly)'
	},
	{
		name: 'bind:seeking',
		description: 'boolean. (readonly)'
	},
	{
		name: 'bind:ended',
		description: 'boolean. (readonly)'
	},
	{
		name: 'bind:currentTime',
		description: 'The current point in the video, in seconds.'
	},
	{
		name: 'bind:playbackRate',
		description: "how fast or slow to play the video, where 1 is 'normal'"
	},
	{
		name: 'bind:paused'
	},
	{
		name: 'bind:volume',
		description: 'A value between 0 and 1'
	},
	{
		name: 'bind:muted'
	},
	{
		name: 'bind:readyState'
	}
];

const videoAttributes = [
	{
		name: 'bind:videoWidth',
		description: 'readonly'
	},
	{
		name: 'bind:videoHeight',
		description: 'readonly'
	}
];

const indeterminateAttribute = {
	name: 'indeterminate',
	description: 'Available for type="checkbox"'
};

/** @type {Record<string, { name: string, description?: string }[]>} */
export const addAttributes = {
	select: [{ name: 'bind:value' }],
	input: [
		{ name: 'bind:value' },
		{ name: 'bind:group', description: 'Available for type="radio" and type="checkbox"' },
		{ name: 'bind:checked', description: 'Available for type="checkbox"' },
		{ name: 'bind:files', description: 'Available for type="file" (readonly)' },
		indeterminateAttribute,
		{ ...indeterminateAttribute, name: 'bind:indeterminate' }
	],
	img: [{ name: 'bind:naturalWidth' }, { name: 'bind:naturalHeight' }],
	textarea: [{ name: 'bind:value' }],
	video: [...mediaAttributes, ...videoAttributes],
	audio: [...mediaAttributes],
	details: [
		{
			name: 'bind:open'
		}
	]
};
