---
title: Personnaliser use:enhance
---

Avec `use:enhance`, nous pouvons aller plus loin que simplement émuler le comportement natif du navigateur. En fournissant un <span class="vo">[callback](PUBLIC_SVELTE_SITE_URL/docs/development#callback)</span>, nous pouvons ajouter des choses comme des **états d'attente** et des **interfaces optimistes**. Simulons un réseau surchargé en ajoutant un délai artificiel à nos deux actions :

```js
/// file: src/routes/+page.server.js
export const actions = {
	create: async ({ cookies, request }) => {
		+++await new Promise((fulfil) => setTimeout(fulfil, 1000));+++
		...
	},

	delete: async ({ cookies, request }) => {
		+++await new Promise((fulfil) => setTimeout(fulfil, 1000));+++
		...
	}
};
```

Lorsque nous créons ou supprimons des tâches, il y a maintenant une seconde d'attente avant que l'interface se mette à jour, ce qui laisse l'utilisateur ou l'utilisatrice dans le doute de si quelque chose s'est mal passé. Pour résoudre cela, ajoutons un état local...

```svelte
/// file: src/routes/+page.svelte
<script>
	import { fly, slide } from 'svelte/transition';
	import { enhance } from '$app/forms';

	export let data;
	export let form;

+++	let creating = false;
	let deleting = [];+++
</script>
```

...et activons `creating` dans le premier `use:enhance` :

```svelte
/// file: src/routes/+page.svelte
<form
	method="POST"
	action="?/create"
+++	use:enhance={() => {
		creating = true;

		return async ({ update }) => {
			await update();
			creating = false;
		};
	}}+++
>
	<label>
		ajouter une tâche :
		<input
			+++disabled={creating}+++
			name="description"
			value={form?.description ?? ''}
			autocomplete="off"
			required
		/>
	</label>
</form>
```

Nous pouvons maintenant afficher un message pendant que nous sauvegardons la donnée :

```svelte
/// file: src/routes/+page.svelte
<ul class="todos">
	<!-- ... -->
</ul>

+++{#if creating}
	<span class="saving">sauvegarde en cours...</span>
{/if}+++
```

Dans le cas de suppressions, nous n'avons pas vraiment besoin d'attendre que le serveur valide quoi que soit — nous pouvons juste mettre à jour l'interface immédiatement :

```svelte
/// file: src/routes/+page.svelte
<ul class="todos">
	{#each +++data.todos.filter((todo) => !deleting.includes(todo.id))+++ as todo (todo.id)}
		<li in:fly={{ y: 20 }} out:slide>
			<form
				method="POST"
				action="?/delete"
				+++use:enhance={() => {
					deleting = [...deleting, todo.id];
					return async ({ update }) => {
						await update();
						deleting = deleting.filter((id) => id !== todo.id);
					};
				}}+++
			>
				<input type="hidden" name="id" value={todo.id} />
				<button aria-label="Marquer comme terminée">✔</button>

				{todo.description}
			</form>
		</li>
	{/each}
</ul>
```

> `use:enhance` est très personnalisable — vous pouvez annuler (`cancel()`) des soumissions, gérer les redirections, contrôler si le formulaire doit être réinitialiser, entre autres. Voir la [documentation](PUBLIC_KIT_SITE_URL/docs/modules#$app-forms-enhance) pour plus de détails.

