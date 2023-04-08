---
title: Event modifiers
---

DOM event handlers can have _modifiers_ that alter their behaviour. For example, a handler with a `once` modifier will only run a single time:

```svelte
/// file: App.svelte
<button on:click+++|once+++={() => alert('clicked')}>
	Click me
</button>
```

The full list of modifiers:

- `preventDefault` — calls `event.preventDefault()` before running the handler. Useful for client-side form handling, for example.
- `stopPropagation` — calls `event.stopPropagation()`, preventing the event reaching the next element
- `passive` — improves scrolling performance on touch/wheel events (Svelte will add it automatically where it's safe to do so)
- `nonpassive` — explicitly set `passive: false`
- `capture` — fires the handler during the _capture_ phase instead of the _bubbling_ phase ([MDN docs](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_capture))
- `once` — remove the handler after the first time it runs
- `self` — only trigger handler if event.target is the element itself
- `trusted` — only trigger handler if `event.isTrusted` is `true`, meaning the event was triggered by a user action rather than because some JavaScript called `element.dispatchEvent(...)`

You can chain modifiers together, e.g. `on:click|once|capture={...}`.
