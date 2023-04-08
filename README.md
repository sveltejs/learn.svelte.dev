# learn.svelte.dev

A soup-to-nuts interactive tutorial on how to build apps with Svelte.

## Setup

This repo uses [pnpm](https://pnpm.io/).

## Developing the app

First, run `node scripts/create-common-bundle`. This packages up everything that's needed to run a SvelteKit app (Vite, Esbuild, SvelteKit, Svelte compiler etc) which can subsequently be unpacked on a server to create and run and instance of a SvelteKit application (which powers the output window of the tutorial). Then, run `dev`:

```bash
node scripts/create-common-bundle
pnpm dev
```

To build for production and run locally:

```bash
pnpm build
pnpm preview
```

## Creating new tutorials

Tutorials live inside `content`. Each tutorial consists of a `README.md`, which is the text to the left, and `app-a` and `app-b` folders, which represent the initial and solved state. Files that stay the same can be omitted from `app-b`. Files are marked as deleted in `app-b` if they start with `__delete`. Folders that are marked as deleted in `app-b` if they contain a file named `__delete`.

## Bumping tutorial dependencies

Bump the dependency (for example Svelte) in both the root and the `content/common` `package.json`. In the root do `pnpm i` (to update `pnpm-lock.yaml`), in `content/common` do `npm i` (to update `package-lock.json`).