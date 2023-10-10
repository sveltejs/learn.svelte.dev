---
title: Câu lệnh
---

Chúng ta không chỉ giới hạn việc khai báo _giá trị_ phản ứng - ta cũng có thể chạy bất kì _câu lệnh_ nào một cách phản ứng. Ví dụ như ta có thể ghi nhật kí giá trị của `count` mỗi khi nó thay đổi.

```js
/// file: App.svelte
let count = 0;

+++$: console.log(`bộ đếm là ${count}`);+++
```

> Kiểm tra Console của bạn qua chức năng `Kiểm tra trang` của trình duyệt.

Bạn có thể dễ dàng nhóm chúng nó lại thành một khối:

```js
/// file: App.svelte
$: +++{+++
	console.log(`bộ đếm là ${count}`);
	console.log(`cái này cũng sẽ được ghi lại khi giá trị thay đổi`);
+++}+++
```

<!-- FIXME: thứ gì cơ? -->
Bạn cũng có thể thêm `$:` vào phía trước những thứ như khối `if`:

```js
/// file: App.svelte
$: +++if (count >= 10)+++ {
	alert('giá trị quá cao!');
	count = 0;
}
```
