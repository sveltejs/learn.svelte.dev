---
title: Component events
---

Components can also dispatch events. To do so, they must create an event dispatcher. Update `Inner.svelte`:

```svelte
/// file: Inner.svelte
<script>
	+++import { createEventDispatcher } from 'svelte';+++

	+++const dispatch = createEventDispatcher();+++

	function sayHello() {
		dispatch('message', {
			text: 'Hello!'
		});
	}
</script>
```

> `createEventDispatcher` must be called when the component is first instantiated — you can't do it later inside e.g. a `setTimeout` callback. This links `dispatch` to the component instance.

Then, add an `on:message` handler in `App.svelte`:

```svelte
/// file: App.svelte
<Inner +++on:message={handleMessage}+++ />
```

> You can also try changing the event name to something else. For instance, change `dispatch('message')` to `dispatch('greet')` in `Inner.svelte` and change the attribute name from `on:message` to `on:greet` in `App.svelte`.
