---
title: Định dạng
---

Cũng như trong HTML, bạn có thể thêm thẻ `<style>` vào component của bạn. Ta hãy thử thêm vài style vào `<p>` nhé:

```svelte
/// file: App.svelte
<p>Đây là một câu văn.</p>

<style>
+++	p {
		color: goldenrod;
		font-family: 'Comic Sans MS', cursive;
		font-size: 2em;
	}+++
</style>
```

Quan trọng hơn, những style này được áp dụng _trong phạm vị của component này_. Bạn sẽ không thể lỡ thay đổi cái style của những `<p>` ở những chỗ khác trong ứng dụng của bạn, như ta sẽ thấy trong phần tiếp theo.