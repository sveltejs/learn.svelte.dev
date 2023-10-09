---
title: Component đầu tiên của bạn
---

Trong Svelte, một ứng dụng bao gồm một hoặc nhiều _component_. Một component là một khối code khép kín _(self-contained)_ có thể dùng lại được, bao gồm các HTML, CSS và JavaScript được gói gọn với nhau và được viết vào tệp với đuôi `.svelte`. Tệp `App.svelte` ở editor phía bên phải, là một component đơn giản.

## Thêm dữ liệu

Một component mà chỉ có nội dung _markup_ tĩnh thì chẳng có gì thú vị. Ta hãy thêm dữ liệu vào nó nhé.

Đầu tiên, thêm một thẻ script vào component của bạn và khai báo một biến `name`:

```svelte
/// file: App.svelte
+++<script>
	let name = 'Svelte';
</script>+++

<h1>Hello world!</h1>
```

Rồi, chúng ta có thể cho giá trị của `name` vào trong markup:

```svelte
/// file: App.svelte
<h1>Hello +++{name}+++!</h1>
```

Ở trong dấu ngoặc nhọn, chúng ta có thể thêm bất kì lệnh JavaScript nào chúng ta muốn. Hãy thử đổi `name` thành `name.toUpperCase()` để có lời chào "lớn tiếng" hơn.

```svelte
/// file: App.svelte
<h1>Hello {name+++.toUpperCase()+++}!</h1>
```
