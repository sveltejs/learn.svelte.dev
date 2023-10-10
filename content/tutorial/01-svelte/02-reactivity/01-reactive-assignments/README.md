---
title: Phép gán
---

Sâu bên trong Svelte là một hệ thống _phản ứng_ _(reactivity)_ mạnh mẽ giúp cho việc đồng bộ hoá DOM với tình trạng ứng dụng của bạn - ví dụ như, một phản hồi cho một sự kiện.

Để chứng minh, ta cần phải nối với một hệ thông xử lý sự kiện _(event handler)_ (ta sẽ được học ở những [phần sau](/tutorial/dom-events)).

```svelte
/// file: App.svelte
<button +++on:click={increment}+++>
	Clicked {count}
	{count === 1 ? 'time' : 'times'}
</button>
```

Bên trong hàm `increment`, những gì chúng ta phải làm là thay đổi giá trị của `count`:

```js
/// file: App.svelte
function increment() {
	+++count += 1;+++
}
```

Svelte sẽ thêm vài cái code vào phép gán này để nó có thể báo DOM khi nào cần được cập nhật.