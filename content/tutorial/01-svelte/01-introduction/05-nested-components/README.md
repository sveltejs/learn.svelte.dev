---
title: Component lồng nhau
---

Sẽ khá là không thực tế nếu bạn viết nguyên một ứng dụng trong một component duy nhất. Thay vào đó, ta có thể nhập các component từ tệp khác và dùng chúng trong markup của ta.

Thêm một thẻ `<script>` ở trên đầu của tệp `App.svelte` để nhập `Nested.svelte`...

```svelte
/// file: App.svelte
+++<script>
	import Nested from './Nested.svelte';
</script>+++
```

...và thêm component `<Nested />`:

```svelte
/// file: App.svelte
<p>Đây là một câu văn.</p>
+++<Nested />+++
```

Lưu ý rằng mặc dù `Nested.svelte` có phần tử `<p>`, style từ `App.svelte` sẽ không bị trôi vào.

> Tên component luôn được viết in hoa đầu chữ, để phân biệt chúng nó với những thẻ HTML.