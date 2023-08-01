---
title: tag HTML
---

En règle générale, les chaînes de caractères sont insérées en tant que texte brut, ce qui signifie que les caractères tels que `<` et `>` n'ont pas de signification particulière.

Mais il est parfois nécessaire de rendre du HTML directement dans un composant. Par exemple, les mots que vous êtes en train de lire existent dans un fichier markdown qui est inclus dans cette page sous la forme d'un bloc HTML.

Dans Svelte, vous le faites avec la balise spéciale `{@html ...}` :

```svelte
/// file: App.svelte
<p>{+++@html+++ string}</p>
```

> **Attention!** Svelte n'effectue pas de nettoyage de l'expression à l'intérieur de `{@html ...}` avant qu'elle ne soit insérée dans le <span class='vo'>[DOM](SITE_SVELTE/docs/web#dom)</span>. Ce n'est pas un problème si le contenu est quelque chose de fiable comme un article que vous avez écrit vous-même. Cependant, s'il s'agit d'un contenu utilisateur non fiable, par exemple un commentaire sur un article, il est essentiel que vous l'échappiez manuellement, sinon vous risquez d'exposer vos utilisateurs à des attaques de type <a href="https://owasp.org/www-community/attacks/xss/" target="_blank">Cross-Site Scripting</a> (XSS).
