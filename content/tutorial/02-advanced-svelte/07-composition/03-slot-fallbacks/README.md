---
title: Slots par défaut
---

Un composant peut préciser un _contenu par défaut_ pour tout <span class="vo">[slot](SVELTE_SITE_URL/docs/sveltejs#slot)</span> laissé vide, en ajoutant du contenu dans l'élément `<slot>` :

```svelte
/// file: Card.svelte
<div class="card">
	<header>
		<slot name="telephone">
			+++<i>(téléphone)</i>+++
		</slot>

		<slot name="company">
			+++<i>(nom de la société)</i>+++
		</slot>
	</header>

	<slot>
		+++<i>(nom)</i>+++
	</slot>

	<footer>
		<slot name="address">
			+++<i>(adresse)</i>+++
		</slot>
	</footer>
</div>
```
