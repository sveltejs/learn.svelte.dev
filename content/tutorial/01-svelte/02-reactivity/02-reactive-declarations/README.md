---
title: Khai báo
---

Svelte sẽ tự động cập nhật DOM khi component của bạn có sự thay đổi. Đôi khi một số phần của component cần phải được cập nhật từ những phần _khác_ (chẳng hạn như `fullname` xuất phát từ `firstname` và `lastname`), và sẽ được tính toán lại khi chúng nó thay đổi.

Cho những trường hợp này, chúng ta sẽ có _khai báo phản ứng_ _(reactive declarations)_ và được viết giống như thế này:

```js
/// file: App.svelte
let count = 0;
+++$: doubled = count * 2;+++
```

Nếu một câu lệnh phản ứng _(reactive statement)_ bao gồm một phép gán cho biến chưa được khai báo, Svelte sẽ tự động thêm vào một khai báo `let` cho biến này.

> Đừng lo nếu cái này nhìn lạ với bạn. Nó là JavaScript [hợp lệ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label) (nhưng không quá phổ biến), tức Svelte sẽ xem nó như 'chạy lại code này mỗi khi bất kì giá trị nào được nêu có sự thay đổi'. Một khi bạn đã quen nó thì sẽ không muốn dùng thứ khác đâu.

Bây giờ chúng ta hãy thêm `doubled` vào cái markup nhé:

```svelte
/// file: App.svelte
<button>...</button>

+++<p>{count} nhân đôi là {doubled}</p>+++
```

Tất nhiên, bạn có thể ghi đơn giản là `{count * 2}` trong cái markup - bạn không cần phải sử dụng giá trị phản ứng (reactive values). Giá trị phản ứng sẽ trở nên có giá trị (không phải chơi chữ) khi bạn cần tham chiếu nó nhiều lần, hoặc bạn có giá trị mà phải dựa trên những giá trị phản ứng _khác_.

<!-- FIXME: what does this even mean -->
> Hãy lưu ý rằng khai báo và câu lệnh phản ứng sẽ được chạy sau những code _script_ khác và trước khi markup của component được xuất ra.
