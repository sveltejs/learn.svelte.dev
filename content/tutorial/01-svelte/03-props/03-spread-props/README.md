---
title: Mở rộng thuộc tính
---

Trong bài này, chúng ta đã quên cho thuộc tính `version` được yêu cầu bởi `PackageInfo.svelte`, tức là nó sẽ hiện `phiên bản undefined`.

Ta _có thể_ sửa nó bằng cách thêm thuộc tính `version`...

```svelte
/// file: App.svelte
<PackageInfo
    name={pkg.name}
	speed={pkg.speed}
    +++version={pkg.version}+++
	website={pkg.website}
/>
```

...nhưng vì thuộc tính của `pkg` giống với thuộc tính trong component kia, ta có thể 'mở rộng' chúng vào thẳng component đấy:

```svelte
/// file: App.svelte
<PackageInfo +++{...pkg}+++ />
```

> Ngược lại, nếu bạn cần tham chiếu tất các thuộc tính được truyền vào một component, bao gồm cả những cái không được khai báo với `export`, bạn có thể truy cập thằng vào `$$props`. Việc này thường không được khuyến khích vì khiến Svelte khó tối ưu hóa, nhưng nó sẽ hữu ích trong một vài trường hợp nhất định.