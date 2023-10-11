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

<!-- TODO: làm rõ phần này -->
> Ngược lại, nếu bạn cần lấy các thuộc tính mà được chuyển vào một component, bao gồm cả những cái không được khai báo với `export`, bạn có thể truy cập thằng vào `$$props` luôn. Thường thì mình không khuyến khích việc này, vì nó làm cho Svelte khó khăn trong việc tối ưu hoá, nhưng nó sẽ hữu ích trong một vài trường hợp.
