---
title: Slot fallbacks
---

A component can specify _fallbacks_ for any slots that are left empty, by putting content inside the `<slot>` element:

```svelte
/// file: Card.svelte
<div class="card">
	<header>
		<slot name="telephone">
			+++<i>(telephone)</i>+++
		</slot>
		
		<slot name="company">
			+++<i>(company name)</i>+++
		</slot>
	</header>

	<slot>
		+++<i>(name)</i>+++
	</slot>
		
	<footer>
		<slot name="address">
			+++<i>(address)</i>+++
		</slot>
	</footer>
</div>
```