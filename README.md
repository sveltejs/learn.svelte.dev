# learn.svelte.dev

A soup-to-nuts interactive tutorial on how to build apps with Svelte.

## Setup

This repo uses [pnpm](https://pnpm.io/).

## Running the app

First, run `node scripts/create-common-bundle`. This packages up everything that's needed to run a SvelteKit app (Vite, Esbuild, SvelteKit, Svelte compiler etc) which can subsequently be unpacked on a server to create and run and instance of a SvelteKit application (which powers the output window of the tutorial).

The next steps depend on whether you want to run this locally in filesystem mode, or in WebContainer mode. For now, it works with filesystem mode only locally. In future, it will run both locally and on the web (using [WebContainers](https://blog.stackblitz.com/posts/introducing-webcontainers/)).

### Local/filesystem mode

1. add an `.env` file with `PUBLIC_USE_FILESYSTEM=true` in it
2. Run the app locally with `pnpm dev` or `pnpm build && pnpm preview`.

### WebContainer mode

1. if an `.env` file exists, modify it so there's `PUBLIC_USE_FILESYSTEM=` in it
2. Run the app locally with `pnpm dev` or `pnpm build && pnpm preview`.

## Creating new tutorials

Tutorials live inside `content`. Each tutorial consists of a `README.md`, which is the text to the left, and `app-a` and `app-b` folders, which represent the initial and solved state. Files that stay the same can be omitted from `app-b`. Files are marked as deleted in `app-b` if they start with `__delete`. Folders that are marked as deleted in `app-b` if they contain a file named `__delete`.

## Bumping tutorial dependencies

Bump the dependency (for example Svelte) in both the root and the `content/common` `package.json`. In the root do `pnpm i` (to update `pnpm-lock.yaml`), in `content/common` do `npm i` (to update `package-lock.json`). After deployment things might be out of date because Vercel caches things, redeploy without cache in that case.
