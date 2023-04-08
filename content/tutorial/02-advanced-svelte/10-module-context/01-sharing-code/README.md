---
title: Sharing code
---

In all the examples we've seen so far, the `<script>` block contains code that runs when each component instance is initialised. For the vast majority of components, that's all you'll ever need.

Very occasionally, you'll need to run some code outside of an individual component instance. For example: returning to our custom audio player from a [previous exercise](media-elements), you can play all five tracks simultaneously. It would be better if playing one stopped all the others.

We can do that by declaring a `<script context="module">` block. Code contained inside it will run once, when the module first evaluates, rather than when a component is instantiated. Place this at the top of `AudioPlayer.svelte`:

```svelte
/// file: AudioPlayer.svelte
+++<script context="module">
	let current;
</script>+++
```

It's now possible for the components to 'talk' to each other without any state management:

```svelte
/// file: AudioPlayer.svelte
<audio
	src={src}
	bind:currentTime={time}
	bind:duration
	bind:paused
+++	on:play={(e) => {
		const audio = e.currentTarget;

		if (audio !== current) {
			current?.pause();
			current = audio;
		}
	}}+++
	on:ended={() => {
		time = 0;
	}}
/>
```
