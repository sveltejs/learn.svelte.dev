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

[README gốc](https://github.com/sveltejs/learn.svelte.dev#readme)