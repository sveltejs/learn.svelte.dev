---
title: Cập nhật các mảng và object
---

Vì tính phản ứng (reactivity) của Svelte chỉ được kích hoạt bởi phép gán, sử dụng những phương thức như `push` hay `splice` thì sẽ không xảy ra việc cập nhật tự động. Ví dụ như khi bạn bấm vào nút 'Thêm một số' thì sẽ không có chuyện gì xảy ra, mặc dù chúng ta đang gọi `numbers.push(...)` ở bên trong `addNumber`.

Một cách để sửa lỗi này là thêm một phép gán mà có lẽ sẽ dư thừa:

```js
/// file: App.svelte
function addNumber() {
	numbers.push(numbers.length + 1);
	+++numbers = numbers;+++
}
```

Nhưng có một cách khác ngắn hơn:

```js
/// file: App.svelte
function addNumber() {
	numbers = +++[...numbers, numbers.length + 1];+++
}
```

Bạn có thể dùng những mẫu giống như trên để thay thế cho `pop`, `shift`, `unshift` và `splice`.

Việc gán vào _thuộc tính_ của mảng và object - ví dụ `obj.foo += 1` or `array[i] = x` - cũng sẽ giống như việc gán vào giá trị chính nó.

```js
/// file: App.svelte
function addNumber() {
	numbers[numbers.length] = numbers.length + 1;
}
```

Có một nguyên tắc đơn giản là: tên của biến được cập nhật phải xuất hiện ở bên trái của phép gán. Ví dụ thế này...

```js
/// no-file
const foo = obj.foo;
foo.bar = 'baz';
```
<!-- FIXME: dùng từ khác cho "tiếp nối" (follow up) -->
...sẽ không kích hoạt tính phản ứng (reactivity) với `obj.foo.bar`, trừ khi bạn tiếp nối với `obj = obj`.