---
title: Thuộc tính động
---

Cũng như việc bạn sử dụng dấu ngoặc nhọn để tinh chỉnh văn bản, bạn cũng có thể dùng nó để chỉnh những thuộc tính của các phần tử.

Ảnh của chúng ta đang bị thiếu thuộc tính `src` - ta hãy thêm nó nhé:

```svelte
/// file: App.svelte
<img +++src={src}+++ />
```

Nhìn được hơn rồi. Nhưng nếu bạn di chuột lên `<img>` trong editor, Svelte sẽ báo lỗi sau:

> A11y: &lt;img&gt; element should have an alt attribute
>
> _(A11y: Phần tử &lt;img&gt; nên có thuộc tính alt)_

Khi xấy dụng một ứng dụng web, quan trọng nhất là mọi thứ _có thể truy cập_ _(accessible)_ được bởi nhiều người dùng nhất có thể, bao gồm những người với thị lực yếu, hoặc với những người không có thiết bị cấu hình mạnh hoặc kết nối internet tốt. Trợ năng (Accessibility, viết tắt là A11y) đôi khi sẽ không hoàn toàn đúng, nhưng Svelte sẽ giúp bằng cách cảnh báo bạn nếu bạn viết markup mà _không có sự truy cập_ _(inaccessible)_.

Trong trường hợp này, chúng ta đang thiếu thuộc tính `alt` dùng để miêu tả bức ảnh cho những người đang sử dụng thiết bị đọc màn hình _(screenreaders)_, hoặc người với tình trạng internet yếu đến mức không thể tải ảnh về. Ta hãy thêm nó nhé:

```svelte
/// file: App.svelte
<img src={src} +++alt="Một người đang múa."+++ />
```

Ta có thể dùng dấu ngoặc nhọn _ở trong_ thuộc tính. Hãy thử đổi nó thành `"{name} đang múa."` - đừng quên khai báo biến `name` trong khối `<script>` nhé!

## Thuộc tính viết tắt

Sẽ khá phổ biến với những trường hợp mà thuộc tính sẽ có tên và giá trị giống nhau, điển hình như `src={src}`. Trong những trường hợp đó, Svelte sẽ có một cách viết tắt ngắn gọn hơn như thế này:

```svelte
/// file: App.svelte
<img +++{src}+++ alt="Một người đang múa." />
```
