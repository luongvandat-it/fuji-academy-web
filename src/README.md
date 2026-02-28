# Cấu trúc dự án FujiWeb

## Tổng quan

Dự án này sử dụng Next.js với App Router, React, TypeScript và SCSS Modules với Tailwind CSS.

## Cấu trúc thư mục

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Route group cho dashboard
│   │   ├── homework/       # Module bài tập
│   │   ├── tuition/        # Module học phí
│   │   ├── schedule/       # Module lịch học
│   │   ├── report/         # Module báo cáo
│   │   └── ...
│   └── login/              # Trang đăng nhập
├── components/             # Shared components
│   ├── layout/            # Layout components
│   └── ui/                # UI components
├── service/               # Business logic & API
│   └── modules/           # Modules theo domain
├── icon/                  # Icon components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities & helpers
├── styles/                # Global styles
└── types/                 # TypeScript type definitions
```

## Tổ chức Styles (SCSS)

### Nguyên tắc chung

1. **CSS Modules**: Tất cả file SCSS đều là `.module.scss` để đảm bảo scoped styles
2. **Tailwind qua @apply**: Không dùng Tailwind trực tiếp trong TSX, chỉ dùng `@apply` trong SCSS
3. **Tách base và responsive**: Responsive styles được tách ra file riêng để dễ maintain

### Cấu trúc module SCSS

Mỗi module lớn có cấu trúc như sau:

```
[module-name]/
├── [module-name].module.scss    # File chính - import base và responsive
└── styles/
    ├── _base.scss               # Base styles (không responsive)
    └── _responsive.scss         # Responsive styles (breakpoints: sm, md, lg)
```

### Responsive code ở đâu?

**Responsive code nằm trong file `styles/_responsive.scss`** riêng biệt!

### Ví dụ cụ thể: Tuition Module

**Cấu trúc:**
```
tuition/
├── tuition.module.scss
└── styles/
    ├── _base.scss          # Base styles (mobile-first)
    └── _responsive.scss    # Responsive styles (desktop)
```

**tuition.module.scss:**
```scss
@reference "../../globals.css";

// Import base styles từ file riêng
@import "./styles/_base.scss";

// Import responsive styles từ file riêng
@import "./styles/_responsive.scss";
```

**styles/_base.scss:**
```scss
// Base styles - không có responsive breakpoints
.page {
  @apply flex h-full min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-hidden;
  height: 100%;
  width: 100%;
  background-color: white;
}

.header {
  @apply flex min-w-0 shrink-0 flex-wrap items-start justify-between gap-2 px-0 pb-3;
}

.title {
  @apply min-w-0 truncate text-xl font-bold tracking-tight text-gray-900;
}
```

**styles/_responsive.scss:**
```scss
// Responsive styles - chỉ có breakpoints
.header {
  @apply sm:items-center sm:gap-3 sm:pb-5 md:pb-6;  // ← Responsive ở đây!
  
  @media (max-width: 419px) {
    @apply flex-col items-start;
  }
}

.title {
  @apply sm:text-2xl md:text-3xl;  // ← Responsive ở đây!
}

.summaryCard {
  @apply sm:p-5;  // ← Responsive ở đây!
}
```

### Cách tìm responsive code

**Responsive code nằm trong file `styles/_responsive.scss`**

**Ví dụ tìm responsive của class `.title`:**
```bash
# Mở file responsive
cat tuition/styles/_responsive.scss | grep "\.title"

# Kết quả:
# .title {
#   @apply sm:text-2xl md:text-3xl;  ← Responsive ở đây!
# }
```

Hoặc trong IDE:
1. Mở file `[module-name]/styles/_responsive.scss`
2. Tìm class bạn muốn (ví dụ: `.title`)
3. Xem các breakpoints `sm:`, `md:`, `lg:`

### Breakpoints

Dự án sử dụng Tailwind breakpoints:
- `sm`: 640px (tablet nhỏ)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (desktop lớn, ít dùng)

### Quy tắc đặt tên class

1. **BEM-inspired**: Sử dụng camelCase cho class names
   - `.page`, `.header`, `.title`
   - `.card`, `.cardTitle`, `.cardBody`
   - `.debtCard`, `.debtCardBody`

2. **Modifiers**: Sử dụng suffix để chỉ trạng thái
   - `.tabBtnActive`, `.tabBtnInactive`
   - `.debtBadgePaid`, `.debtBadgePending`
   - `.cardIconWrapPending`, `.cardIconWrapSubmitted`

3. **Nested elements**: Sử dụng camelCase compound names
   - `.summaryCardIcon`
   - `.barChartBarFill`
   - `.activityIconWrap`

### Modules đã refactor

Các module sau đã được tổ chức với responsive code tách riêng:

- ✅ `schedule/` - Module lịch học
- ✅ `tuition/` - Module học phí
- ✅ `homework/` - Module bài tập
- ✅ `report/` - Module báo cáo

## Cách thêm styles mới

### Thêm base style

Thêm vào **`styles/_base.scss`**:

```scss
.newComponent {
  @apply flex items-center gap-2 rounded-lg bg-white p-4;
}
```

### Thêm responsive style

Thêm vào **`styles/_responsive.scss`**:

```scss
.newComponent {
  @apply sm:p-5 md:p-6;  // Responsive cho desktop
}
```

**Lưu ý**: 
- Base styles ở `_base.scss` (mobile-first)
- Responsive styles ở `_responsive.scss` (desktop)
- Class được định nghĩa **2 lần** ở 2 file khác nhau

## Best Practices

1. **Mobile-first**: Viết base styles cho mobile trước, responsive cho desktop sau
2. **Dùng @apply**: Luôn dùng `@apply` thay vì viết CSS thuần
3. **CSS thuần chỉ khi cần**: Chỉ dùng CSS thuần cho các trường hợp đặc biệt:
   - `-webkit-overflow-scrolling: touch`
   - Custom scrollbar (`&::-webkit-scrollbar`)
   - CSS variables không có trong Tailwind
   - Media queries phức tạp (`@media (max-width: 419px)`)
4. **Theme colors**: Dùng CSS variables từ theme: `var(--theme-focus)`, `bg-[var(--theme-primary-50)]`
5. **Tổ chức code**: 
   - Base styles → `styles/_base.scss`
   - Responsive styles → `styles/_responsive.scss`
   - File chính → `[module].module.scss` (chỉ import)

## Ví dụ đầy đủ

**File: `tuition.module.scss`**
```scss
@reference "../../globals.css";

@import "./styles/_base.scss";
@import "./styles/_responsive.scss";
```

**File: `styles/_base.scss`**
```scss
.card {
  @apply flex flex-col gap-2 rounded-lg bg-white p-3;
}

.cardTitle {
  @apply text-sm font-semibold text-gray-900;
}
```

**File: `styles/_responsive.scss`**
```scss
.card {
  @apply sm:gap-4 sm:rounded-xl sm:p-5;  // Responsive!
}

.cardTitle {
  @apply sm:text-base md:text-lg;  // Responsive!
}
```

## Lưu ý quan trọng

- ✅ Responsive code nằm trong file **`styles/_responsive.scss`** riêng biệt
- ✅ Base code nằm trong file **`styles/_base.scss`** riêng biệt
- ✅ File `.module.scss` chỉ import 2 file trên
- ✅ Luôn dùng `@reference` thay vì `@import` cho `globals.css`
- ✅ Không import file SCSS khác trong TSX, chỉ dùng `className={styles.xxx}`
- ⚠️ Có thể có warning về `@import` deprecated, nhưng vẫn hoạt động bình thường
