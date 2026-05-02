# 📸 Hướng Dẫn Tối Ưu Hóa Ảnh cho Website

## ✅ Đã Áp Dụng

Các tối ưu hóa sau đã được tích hợp vào website:

### 1. **Preload Ảnh Quan Trọng**
- Ảnh nền và logo được preload với `fetchpriority="high"`
- Ảnh chỉ được preload cho đúng kích thước màn hình (mobile/desktop)

### 2. **Lazy Loading & Async Decoding**
- Tất cả ảnh trong carousel sử dụng `loading="lazy"` và `decoding="async"`
- Ảnh quan trọng (hero section) dùng `loading="eager"`

### 3. **Service Worker Caching**
- Cache ảnh riêng biệt với chiến lược "Cache First"
- Ảnh được cache lâu dài, tải ngay từ cache khi truy cập lần 2

### 4. **CSS Optimization**
- Hardware acceleration với `transform: translateZ(0)`
- Image rendering optimization cho mobile
- Loading placeholder với gradient animation

### 5. **Smart Image Loading**
- Chỉ tải ảnh phù hợp với kích thước màn hình
- Preload thông minh dựa trên viewport

---

## 🚀 Tối Ưu Hóa Thêm (Khuyến Nghị)

### 1. **Chuyển Đổi Sang WebP**

WebP nhẹ hơn PNG/JPG khoảng 25-35%. Sử dụng công cụ online:

**Công cụ trực tuyến:**
- https://squoosh.app (Google)
- https://tinypng.com
- https://cloudconvert.com/png-to-webp

**Cách sử dụng:**
1. Upload file `2.png`, `1.png`, `3.png`
2. Chọn format WebP
3. Quality: 80-85% (cân bằng chất lượng/kích thước)
4. Download file mới

**Sau khi có file WebP, cập nhật HTML:**

```html
<!-- Thay vì -->
<img src="1.png" alt="Logo">

<!-- Dùng picture tag với fallback -->
<picture>
  <source srcset="1.webp" type="image/webp">
  <img src="1.png" alt="Logo">
</picture>
```

### 2. **Nén Ảnh Hiện Tại**

Nếu chưa muốn chuyển sang WebP, hãy nén ảnh PNG/JPG:

**Công cụ nén:**
- **TinyPNG**: https://tinypng.com (miễn phí, tốt nhất cho PNG)
- **Compressor.io**: https://compressor.io
- **ImageOptim** (Mac): https://imageoptim.com

**Mục tiêu:**
- Ảnh nền mobile (`2.png`): < 300KB
- Logo (`1.png`, `3.png`): < 100KB mỗi file
- Ảnh trong gallery: < 200KB mỗi file

### 3. **Tạo Ảnh Responsive**

Tạo nhiều kích thước cho mỗi ảnh:

```
2.png         → 2-1920.png (desktop, 1920px)
              → 2-768.png  (tablet, 768px)  
              → 2-480.png  (mobile, 480px)
```

**Sử dụng trong HTML:**

```html
<img 
  srcset="2-480.png 480w, 
          2-768.png 768w, 
          2-1920.png 1920w"
  sizes="(max-width: 480px) 480px,
         (max-width: 768px) 768px,
         1920px"
  src="2.png" 
  alt="Background">
```

### 4. **Tối Ưu SVG**

Cho file `1.svg`, `trongdong.svg`:

**Công cụ:**
- https://jakearchibald.github.io/svgomg/

**Cách làm:**
1. Upload SVG
2. Giữ nguyên các tùy chọn mặc định
3. Download file đã tối ưu

### 5. **Sử dụng CDN (Nâng Cao)**

Upload ảnh lên CDN miễn phí để tăng tốc độ tải:

**CDN miễn phí:**
- **Cloudinary**: https://cloudinary.com (Free: 25GB/tháng)
- **Imgur**: https://imgur.com
- **imgbb**: https://imgbb.com

**Cloudinary có tính năng tự động:**
- Chuyển sang WebP
- Resize theo thiết bị
- Lazy loading
- Cache toàn cầu

---

## 📊 Kiểm Tra Hiệu Suất

Sau khi tối ưu, test website với:

1. **Google PageSpeed Insights**
   - https://pagespeed.web.dev
   - Mục tiêu: Mobile score > 90

2. **WebPageTest**
   - https://www.webpagetest.org
   - Test từ vị trí mobile 3G

3. **Lighthouse** (Chrome DevTools)
   - Nhấn F12 → Tab Lighthouse
   - Chọn Mobile + Performance

---

## ⚡ Kết Quả Mong Đợi

Sau khi áp dụng các tối ưu hóa:

| Metric | Trước | Sau (Mục tiêu) |
|--------|-------|----------------|
| **First Contentful Paint** | ~2-3s | < 1.5s |
| **Largest Contentful Paint** | ~3-4s | < 2.5s |
| **Total Image Size** | ~2-3MB | < 800KB |
| **Mobile Performance** | 60-70 | 90+ |

---

## 🔧 Quick Wins (Làm ngay)

1. ✅ **Nén `2.png`** (ảnh nền mobile) với TinyPNG
2. ✅ **Nén tất cả ảnh trong `/assets/anh/`**
3. ✅ **Chuyển logo sang WebP** (nhẹ hơn rất nhiều)

---

## 📝 Checklist

- [ ] Nén tất cả file PNG/JPG bằng TinyPNG
- [ ] Chuyển đổi ảnh quan trọng sang WebP
- [ ] Tạo các version responsive cho ảnh lớn
- [ ] Tối ưu file SVG
- [ ] Test với PageSpeed Insights
- [ ] Kiểm tra trên thiết bị mobile thật

---

## 💡 Lưu Ý

- **Backup** các file ảnh gốc trước khi tối ưu
- **Test kỹ** sau mỗi thay đổi trên nhiều thiết bị
- **Cache**: Có thể cần hard refresh (Ctrl+F5) để thấy thay đổi
- **Service Worker**: Tăng version trong `service-worker.js` khi update ảnh

---

Nếu cần hỗ trợ thêm, hãy cho tôi biết! 🚀
