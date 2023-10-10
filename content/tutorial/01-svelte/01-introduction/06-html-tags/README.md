---
title: Thẻ HTML
---

Bình thường, dải kí tự sẽ được chèn vào dưới dạng văn bản thường, có nghĩa là những kí tự như `<` và `>` không có ý nghĩa gì cả.

Nhưng đôi khi bạn cần thêm HTML thẳng vào trong component. Chẳng hạn, những từ mà bạn đang đọc ngay bây giờ đang tồn tại trong một tệp markdown được bao gồm trong trang này dưới dạng HTML.

Trong Svelte, bạn có thể làm thế với thẻ `{@html ...}` đặc biệt:

```svelte
/// file: App.svelte
<p>{+++@html+++ string}</p>
```

> **LƯU Ý!** Svelte không khử các biểu thức _(expression)_ bên trong `{@html ...}` trước khi nó được chèn vào trong _DOM_. Đây không hẵn là vấn đề nếu nội dung là những thứ mà bạn có thể tin cậy như một bài báo mà bạn tự viết. Tuy nhiên, nếu nó là nội dung do người dùng viết mà không tin cậy, ví dụ như một bình luận trên bài báo, thì việc khử các biểu thức là điều rất quan trọng, còn không thì người dùng của bạn sẽ bị dính phải những cuộc tấn công liên quan tới  <a href="https://owasp.org/www-community/attacks/xss/" target="_blank">Tập lệnh chéo trang</a> (_Cross-Site Scripting_ - XSS).
