---
title: Khai báo thuộc tính
---

<!-- FIXME: dịch internal state như thế nào? -->
Đến bây giờ, chúng ta đã làm việc với những trạng thái bên trong _(internal state)_ - phải nói là, những giá trị ấy chỉ có thể truy cập được trong mỗi component đó.

Nhưng trong các ứng dụng ngoài đời, bạn cần phải chuyển dữ liệu từ component này xuống những thành phần con của nó. Để làm thế, ta cần phải khai báo _thuộc tính_ _(properties)_, thường sẽ được viết tắt là 'props'. Trong Svelte, ta có thể làm thế với từ khoá `export`. Hãy sửa component `Nested.svelte` thành:

```svelte
/// file: Nested.svelte
<script>
	+++export+++ let answer;
</script>
```

> Cứ như `$:`, cái này nhìn có vẻ lạ một chút. Bởi vì bình thường `export` không hoạt động như thế trong mô-đun JavaScript! Nhưng mà bạn cứ dùng đi - bạn sẽ quen dần thôi.
