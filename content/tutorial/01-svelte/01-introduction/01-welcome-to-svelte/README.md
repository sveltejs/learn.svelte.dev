---
title: Chào mừng đến với Svelte
---

Chào mừng đến với hướng dẫn về Svelte! Bạn sẽ được dạy mọi thứ mà bạn cần biết để có thể dễ dàng xây dựng bất kì ứng dụng web, với hiệu suất cao và footprint nhỏ.

Bạn cũng có thể tham khảo [API docs](https://svelte.dev/docs) và [những ví dụ](https://svelte.dev/examples), hoặc - nếu bạn không thể chờ đợi để được vọc vạch trên máy của bạn - hãy tạo một dự án với `npm init svelte`.

> Bản dịch tiếng Việt hiện tại chưa được hoàn chỉnh, nếu có vấn đề thì bạn nên mở issue [tại đây](https://github.com/sveltevietnam/learn.svelte.dev/issues).

## Svelte là gì?

Svelte là một công cụ để xây dụng ứng dụng web. Như bao những framework về giao diện người dùng khác, nó cho phép bạn xây dụng ứng dụng _một cách khai báo_ _(declaratively)_ từ những thành phần _(components)_ kết hợp với đánh dấu _(markup)_, định dạng _(styles)_ và hành vi _(behaviours)_.

Những component này được _dịch_ _(compile)_ thành những mô-đun JavaScript nhỏ mà hiệu quả, giúp loại bỏ những gánh nặng mà những UI framework khác thường mắc phải.

Bạn có thể xây dựng nguyên cả một ứng dụng với Svelte (ví dụ: sử dụng _ứng dụng framework_ như [SvelteKit](https://kit.svelte.dev), sẽ được nói đến trong hướng dẫn này), hoặc bạn có thể thêm vào codebase có sẵn. Bạn cũng có thể ship những component thành những gói độc lập mà có thể hoạt động ở bất kì đâu.

## Làm sao để sử dụng hướng dẫn này

> Bạn cần phải có nền tảng cơ bản về HTML, CSS và JavaScript để có thể hiểu Svelte.

Hướng dẫn này được chia thành 4 phần chính:

- [Svelte cơ bản](/tutorial/welcome-to-svelte) (bạn đang ở đây!)
- [Svelte nâng cao](/tutorial/tweens)
- [SvelteKit cơ bản](/tutorial/introducing-sveltekit)
- [SvelteKit nâng cao](/tutorial/optional-params)

Mỗi phần sẽ đưa ra những bài tập để bạn làm quen với chức năng đó. Những bài tập sau nữa sẽ được dựng trên kiến thức mà bạn đã thu nhận được từ những bài trước, cho nên mình khuyến khích bạn nên làm từ đầu đến cuối. Nếu cần thiết, bạn có thể chọn bài khác bằng menu ở trên. 

Nếu bạn bí ý tưởng, bạn có thể bấm nút `giải` <span class="desktop">ở bên trái editor</span><span class="mobile">ở bên trên phải của editor</span>. (<span class="mobile">Dùng toggle bên dưới để chuyển giữa phần hướng dẫn và editor. </span>Nút `giải` sẽ bị vô hiệu hoá cho những phần như thế này nếu như không có bài tập nào.) Cố gắng đừng dựa dẫm nút đó quá nhiều; bạn sẽ học nhanh hơn bằng cách tìm ra chỗ để đặt code và tự bạn viết tay vào trong cái editor.
