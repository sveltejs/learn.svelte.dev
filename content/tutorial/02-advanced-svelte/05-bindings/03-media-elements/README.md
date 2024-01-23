---
title: Media elements
---

You can bind to properties of `<audio>` and `<video>` elements, making it easy to (for example) build custom player UI, like `AudioPlayer.svelte`.

First, add the `<audio>` element along with its bindings (we'll use the shorthand form for `src`, `duration` and `paused`):

```svelte
/// file: AudioPlayer.svelte
<div class="player" class:paused>
+++	<audio
		{src}
		bind:currentTime={time}
		bind:duration
		bind:paused
	/>+++

	<button
		class="play"
		aria-label={paused ? 'play' : 'pause'}
	/>
```

Next, add an event handler to the `<button>` that toggles `paused`:

```svelte
/// file: AudioPlayer.svelte
<button
	class="play"
	aria-label={paused ? 'play' : 'pause'}
	+++on:click={() => paused = !paused}+++
/>
```

Our audio player now has basic functionality. Let's add the ability to seek to a specific part of a track by dragging the slider. Inside the slider's `pointerdown` handler there's a `seek` function, where we can update `time`:

```js
/// file: AudioPlayer.svelte
function seek(e) {
	const { left, width } = div.getBoundingClientRect();

	let p = (e.clientX - left) / width;
	if (p < 0) p = 0;
	if (p > 1) p = 1;

	+++time = p * duration;+++
}
```

When the track ends, be kind — rewind:

```svelte
/// file: AudioPlayer.svelte
<audio
	{src}
	bind:currentTime={time}
	bind:duration
	bind:paused
+++	on:ended={() => {
		time = 0;
	}}+++
/>
```

The complete set of bindings for `<audio>` and `<video>` is as follows — seven _readonly_ bindings...

- `duration` (readonly) — the total duration, in seconds
- `buffered` (readonly) — an array of `{start, end}` objects
- `seekable` (readonly) — ditto
- `played` (readonly) — ditto
- `seeking` (readonly) — boolean
- `ended` (readonly) — boolean
- `readyState` (readonly) — number between (and including) 0 and 4

...and five _two-way_ bindings:

- `currentTime` — the current position of the playhead, in seconds
- `playbackRate` — speed up or slow down (`1` is 'normal')
- `paused` — this one should be self-explanatory
- `volume` — a value between 0 and 1
- `muted` — a boolean value where true is muted

Videos additionally have readonly `videoWidth` and `videoHeight` bindings.
