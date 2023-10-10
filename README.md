# learn.svelte.dev

Hướng dẫn tất tần tật & thực hành để xây dụng một ứng dụng web với Svelte, phiên bản tiếng Việt cho cộng đồng Việt.

## Cài đặt

Repo này sử dụng [pnpm](https://pnpm.io/).

## Phát triển app

Đầu tiên, bạn hãy chạy `node scripts/create-common-bundle`. Gói này sẽ cài tất cả mọi thứ cần thiết (Vite, esbuild, SvelteKit, Svelte compiler, v.v.) để có thể chạy trên server và tạo một app SvelteKit (được dùng để chạy đầu ra của trang hướng dẫn này). Sau đó, chạy `dev`:

```bash
node scripts/create-common-bundle
pnpm dev
```

Để build cho production và chạy trên máy bạn:

```bash
pnpm build
pnpm preview
```

_Nếu `node scripts/create-common-bundle` bị lỗi, hãy thử `pnpm install` rồi chạy lại. Nếu báo lỗi không tìm thấy gì trong `create-common-bundle`, hãy thêm `/index.js`._

## Tạo và dịch hướng dẫn

Hướng dẫn nằm trong thư mục `content`. Mỗi hướng dẫn sẽ có `README.md`, sẽ là đoạn text phía bên trái, và thư mục `app-a` & `app-b`, sẽ đại diện cho `chưa giải` và `đã giải`. Tệp mà không có thay đổi gì trong công đoạn `đã giải` thì có thể bỏ qua trong `app-b`.

Tệp đánh dấu là đã xoá trong `app-b` nếu mở đầu file bằng `__delete`. Thư mục đánh dấu là đã xoá trong `app-b` nếu có một tệp tên là `__delete`.

Mình khuyến khích nên dịch `README.md` và cả các file trong `app-a` & `app-b` để mọi người dễ hinh dung.

## Bumping dependencies

Nhảy gói dependency (vd. Svelte) ở trong thư mục gốc và `content/common` `package.json`. Trong thư mục gốc, bấm `pnpm i` (để cập nhất `pnpm-lock.yaml`), trong `content/common` bấm `npm i` (để cập nhật `package-lock.json`).

### _Dưới đây là `README.md` gốc:_

# learn.svelte.dev

A soup-to-nuts interactive tutorial on how to build apps with Svelte.


## Setup

This repo uses [pnpm](https://pnpm.io/).

## Developing the app

First, run `node scripts/create-common-bundle`. This packages up everything that's needed to run a SvelteKit app (Vite, esbuild, SvelteKit, Svelte compiler, etc.) which can subsequently be unpacked on a server to create and run an instance of a SvelteKit application (which powers the output window of the tutorial). Then, run `dev`:

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