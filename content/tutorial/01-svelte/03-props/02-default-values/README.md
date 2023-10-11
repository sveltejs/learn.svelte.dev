---
title: Giá trị mặc định
---

Ta có thể dễ dàng cho vào một giá trị mặc định cho thuộc tính trong `Nested.svelte`:

```svelte
/// file: Nested.svelte
<script>
	export let answer +++= 'một bí mật'+++;
</script>
```

Nếu bây giờ bạn thử thêm component thứ hai mà _không có_ thuộc tính `answer`, nó sẽ tự rơi về giá trị mặc định:

```svelte
/// file: App.svelte
<Nested answer={42}/>
+++<Nested />+++
```
