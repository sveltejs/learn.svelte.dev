import { svelteLanguage } from '@replit/codemirror-lang-svelte';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import { syntaxTree } from '@codemirror/language';
import { snippetCompletion } from '@codemirror/autocomplete';
import {
	addAttributes,
	svelteAttributes,
	svelteTags,
	sveltekitAttributes,
	svelteEvents
} from './autocompletionDataProvider.js';

const logic_block_snippets = [
	snippetCompletion('#if ${}}\n\n{/if', { label: '#if', type: 'keyword' }),
	snippetCompletion('#each ${} as }\n\n{/each', {
		label: '#each',
		type: 'keyword'
	}),
	snippetCompletion('#await ${} then }\n\n{/await', {
		label: '#await then',
		type: 'keyword'
	}),
	snippetCompletion('#await ${}}\n\n{:then }\n\n{/await', {
		label: '#await :then',
		type: 'keyword'
	}),
	snippetCompletion('#key ${}}\n\n{/key', { label: '#key', type: 'keyword' })
];

const special_tag_snippets = [
	snippetCompletion('@html ${}', { label: '@html', type: 'keyword' }),
	snippetCompletion('@debug ${}', { label: '@debug', type: 'keyword' }),
	snippetCompletion('@const ${}', { label: '@const', type: 'keyword' })
];

/**
 * @param {import('@codemirror/autocomplete').CompletionContext} context
 * @param {import("@lezer/common").SyntaxNode} node
 */
function completion_for_block(context, node) {
	const prefix = context.state.doc.sliceString(node.from, node.from + 1);

	const from = node.from;
	const to = context.pos;

	const type = 'keyword';

	if (prefix === '/') {
		/** @param {string} label */
		const completion = (label) => ({ from, to, options: [{ label, type }], validFor: /^\/\w*$/ });

		const parent = node.parent;
		const block = node.parent?.parent;

		if (parent?.name === 'EachBlockClose' || block?.name === 'EachBlock') {
			return completion('/each');
		} else if (parent?.name === 'IfBlockClose' || block?.name === 'IfBlock') {
			return completion('/if');
		} else if (parent?.name === 'AwaitBlockClose' || block?.name === 'AwaitBlock') {
			return completion('/await');
		} else if (parent?.name === 'KeyBlockClose' || block?.name === 'KeyBlock') {
			return completion('/key');
		}
	} else if (prefix === ':') {
		/** @param {import('@codemirror/autocomplete').Completion[]} options */
		const completion = (options) => ({ from, to, options, validFor: /^\:\w*$/ });

		const parent = node.parent;
		const block = node.parent?.parent;

		if (parent?.name === 'ElseBlock' || block?.name === 'IfBlock') {
			return completion([
				{ label: ':else', type },
				{ label: ':else if ', type }
			]);
		} else if (parent?.name === 'ThenBlock' || block?.name === 'AwaitBlock') {
			return completion([
				{ label: ':then', type },
				{ label: ':catch', type }
			]);
		}
	} else if (prefix === '#') {
		return { from, to, options: logic_block_snippets, validFor: /^#(\w)*$/ };
	} else if (prefix === '@') {
		return { from, to, options: special_tag_snippets, validFor: /^@(\w)*$/ };
	}

	return null;
}

const options_for_svelte_events = svelteEvents.map((event) =>
	snippetCompletion(event.name + '={${}}', {
		label: event.name,
		info: event.description,
		type: 'keyword'
	})
);

const options_for_sveltekit_attributes = sveltekitAttributes.map((attr) => ({
	label: attr.name,
	info: attr.description,
	type: 'keyword'
}));

const options_for_sveltekit_attr_values = sveltekitAttributes.reduce((prev, cur) => {
	prev[cur.name] = cur.values.map((value) => ({ label: value.name, type: 'keyword' }));
	return prev;
}, /** @type {Record<string, import('@codemirror/autocomplete').Completion[]>} */ ({}));

/**
 * @param {{ name: string, description?: string}[]} attributes
 */
function snippet_for_attribute(attributes) {
	return attributes.map((attr) =>
		snippetCompletion(attr.name + '={${}}', {
			label: attr.name,
			info: attr.description,
			type: 'keyword'
		})
	);
}

const options_for_svelte_attributes = snippet_for_attribute(svelteAttributes);

const options_for_svelte_tags = svelteTags.reduce((tags, tag) => {
	tags[tag.name] = snippet_for_attribute(tag.attributes);
	return tags;
}, /** @type {Record<string, import('@codemirror/autocomplete').Completion[]>} */ ({}));

/**
 * @param {import('@codemirror/autocomplete').CompletionContext} context
 * @param {import("@lezer/common").SyntaxNode} node
 */
function completion_for_attributes(context, node) {
	/** @param {import('@codemirror/autocomplete').Completion[]} options */
	const completion = (options) => {
		return { from: node.from, to: context.pos, options, validFor: /^\w*$/ };
	};

	const global_options = [
		...options_for_svelte_events,
		...options_for_svelte_attributes,
		...options_for_sveltekit_attributes
	];

	if (node.parent?.parent?.firstChild?.nextSibling?.name === 'SvelteElementName') {
		const tag_node = node.parent.parent.firstChild.nextSibling;
		const tag = context.state.doc.sliceString(tag_node.from, tag_node.to);
		return completion([...global_options, ...options_for_svelte_tags[tag]]);
	} else if (node.parent?.parent?.firstChild?.nextSibling?.name === 'TagName') {
		const tag_node = node.parent.parent.firstChild.nextSibling;
		const tag = context.state.doc.sliceString(tag_node.from, tag_node.to);
		if (addAttributes[tag]) {
			const completions_attributes = snippet_for_attribute(addAttributes[tag]);
			return completion([...global_options, ...completions_attributes]);
		}
	}

	return completion(global_options);
}

/**
 * @param {import('@codemirror/autocomplete').CompletionContext} context
 * @param {import("@lezer/common").SyntaxNode} node
 * @param {string} attr
 */
function completion_for_sveltekit_attr_values(context, node, attr) {
	const options = options_for_sveltekit_attr_values[attr];
	if (options) {
		return {
			from: node.name === 'AttributeValueContent' ? node.from : node.from + 1,
			to: context.pos,
			options,
			validFor: /^\w*$/
		};
	}

	return null;
}

/**
 * @param {import('@codemirror/autocomplete').CompletionContext} context
 * @returns {import('@codemirror/autocomplete').CompletionResult | null}
 */
function completion_for_markup(context) {
	const node_before = syntaxTree(context.state).resolveInner(context.pos, -1);

	if (node_before.name === 'BlockPrefix') {
		return completion_for_block(context, node_before);
	} else if (node_before.prevSibling?.name === 'BlockPrefix') {
		return completion_for_block(context, node_before.prevSibling);
	} else if (node_before.name === 'AttributeName') {
		return completion_for_attributes(context, node_before);
	} else if (
		node_before.name === 'DirectiveOn' ||
		node_before.name === 'DirectiveBind' ||
		node_before.name === 'DirectiveTarget'
	) {
		if (node_before.parent) {
			return completion_for_attributes(context, node_before.parent);
		}
	} else if (node_before.parent?.name === 'AttributeValue') {
		if (node_before.parent?.parent?.firstChild) {
			const attr_name_node = node_before.parent.parent.firstChild;
			const attr_name = context.state.doc.sliceString(attr_name_node.from, attr_name_node.to);

			if (attr_name.startsWith('data-sveltekit-')) {
				return completion_for_sveltekit_attr_values(context, node_before, attr_name);
			}
		}
	}

	return null;
}

/**
 * @param {import('@codemirror/autocomplete').CompletionContext} context
 * @returns {import('@codemirror/autocomplete').CompletionResult | null}
 */
function completion_for_javascript(context) {
	// TODO autocompletion for import source

	return null;
}

export function autocomplete_for_svelte() {
	return [
		svelteLanguage.data.of({
			autocomplete: completion_for_markup
		}),
		javascriptLanguage.data.of({
			autocomplete: completion_for_javascript
		})
	];
}
