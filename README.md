# 🇻🇳 Văn kiện Tỉnh đoàn - Trợ lý Đại hội Số

![Banner](assets/images/hero1.jpg)

## 📝 Giới thiệu
**Văn kiện Tỉnh đoàn (Trợ lý Đại hội Số)** là một ứng dụng web hiện đại (PWA) được thiết kế đặc biệt nhằm phục vụ các đại biểu tham dự Đại hội Đại biểu Đoàn TNCS Hồ Chí Minh tỉnh Phú Thọ lần thứ I, nhiệm kỳ 2025-2030. Với phương châm *"Khát vọng đất tổ - Vươn mình trong kỷ nguyên số"*, ứng dụng cung cấp một nền tảng số hóa toàn diện để tra cứu tài liệu, theo dõi chỉ tiêu, nghe podcast và tương tác trực tuyến, giúp nâng cao hiệu quả và tính chuyên nghiệp của công tác tổ chức Đại hội.

---

## ✨ Tính năng nổi bật
Dự án tích hợp nhiều tính năng thông minh và tiện ích:
*   **📚 Hệ thống Văn kiện Số**: Tra cứu và xem trực tuyến các báo cáo chính trị, dự thảo văn kiện và tài liệu hướng dẫn qua giao diện xem trước (preview) hiện đại.
*   **🎙️ Podcast Player**: Hệ thống phát thanh thanh niên tích hợp, cho phép nghe các bản tin, báo cáo âm thanh trực tiếp trên trình duyệt với thanh điều khiển mượt mà.
*   **📊 Dashboard Chỉ tiêu**: Hiển thị trực quan các số liệu thực hiện chỉ tiêu nhiệm kỳ thông qua các biểu đồ và thanh tiến độ động.
*   **🎮 Mini Game & Tương tác**: Khu vực giải trí với hiệu ứng confetti và các hoạt động tương tác giúp tăng tính kết nối giữa các đại biểu.
*   **✅ Check-in Đại biểu**: Hệ thống tìm kiếm nhanh và xác nhận tham dự thông minh dành cho đại biểu và các đơn vị.
*   **📱 Trải nghiệm PWA**: Hỗ trợ cài đặt như một ứng dụng di động, có khả năng hoạt động ngoại tuyến và truy cập nhanh từ màn hình chính.
*   **⏳ Đếm ngược sự kiện**: Đồng hồ đếm ngược thời gian thực đến phiên trọng thể của Đại hội.

---

## 🚀 Công nghệ sử dụng
Dự án được xây dựng trên nền tảng Web tiêu chuẩn với các công nghệ tối ưu:

*   **Frontend**:
    *   **HTML5 & CSS3**: Cấu trúc ngữ nghĩa và giao diện tùy chỉnh.
    *   **Tailwind CSS (via CDN)**: Framework CSS hiện đại cho thiết kế responsive và layout nhanh chóng.
    *   **Vanilla JavaScript (ES6+)**: Xử lý logic nghiệp vụ, tương tác người dùng và điều khiển trình phát audio.
*   **Thư viện & Công cụ**:
    *   **Font Awesome 6**: Hệ thống icon chuyên nghiệp.
    *   **Google Fonts (Be Vietnam Pro)**: Phông chữ hiện đại, hỗ trợ tiếng Việt hoàn hảo.
    *   **Canvas Confetti**: Hiệu ứng chúc mừng sinh động.
*   **PWA Technology**:
    *   **Service Worker**: Xử lý caching và hỗ trợ offline.
    *   **Web Manifest**: Định nghĩa thông tin ứng dụng để cài đặt trên thiết bị di động.

---

## 📂 Cấu trúc thư mục
Cấu trúc dự án được tổ chức theo tiêu chuẩn sạch (Clean Architecture), dễ bảo trì:

```text
/
├── assets/                 # Tài nguyên tĩnh của ứng dụng
│   ├── images/             # Hình ảnh chính, logo, banner
│   │   └── highlights/     # Bộ sưu tập ảnh tiêu biểu của Đại hội
│   └── audio/              # Các file âm thanh, bản tin Podcast (.m4a)
├── css/                    # Định nghĩa phong cách
│   └── styles.css          # Tệp CSS chính (tách biệt từ HTML)
├── js/                     # Xử lý logic và tương tác
│   └── main.js             # Mã nguồn JavaScript chính điều khiển ứng dụng
├── data/                   # Dữ liệu tĩnh
│   └── delegates-data.js   # Danh sách và thông tin đại biểu
├── docs/                   # Tài liệu hướng dẫn phát triển
├── index.html              # Trang chủ ứng dụng
├── manifest.json           # Cấu hình Web App Manifest
└── service-worker.js       # Quản lý bộ nhớ đệm và hỗ trợ Offline
```

---

## 🛠️ Hướng dẫn cài đặt & Chạy dự án
Vì đây là một dự án Web tĩnh, việc triển khai cực kỳ đơn giản:

### 1. Yêu cầu hệ thống
*   Máy tính đã cài đặt trình duyệt web hiện đại (Chrome, Edge, Safari, Firefox).
*   (Tùy chọn) Một công cụ tạo Web Server cục bộ (như Live Server trên VS Code).

### 2. Các bước khởi chạy
1.  **Tải mã nguồn**: Clone repository từ GitHub hoặc tải file ZIP về máy.
    ```bash
    git clone https://github.com/vi-phuong-158/van-kien-tinh-doan.git
    ```
2.  **Mở dự án**: Di chuyển vào thư mục dự án.
3.  **Khởi chạy**:
    *   **Cách 1**: Click đúp vào file `index.html` để mở trực tiếp trên trình duyệt.
    *   **Cách 2 (Khuyến nghị)**: Sử dụng extension **Live Server** trên VS Code để chạy dự án tại địa chỉ `http://127.0.0.1:5500`. Điều này giúp đảm bảo các tính năng Service Worker hoạt động chính xác nhất.

---

## 🗺️ Kế hoạch phát triển (Roadmap)
Dựa trên nền tảng hiện tại, hệ thống có thể được nâng cấp các tính năng sau:

1.  **🔔 Thông báo đẩy (Push Notifications)**: Tích hợp thông báo thời gian thực để nhắc lịch họp, gửi tin nhắn khẩn cấp hoặc thông báo kết quả bầu cử trực tiếp tới thiết bị của đại biểu.
2.  **🗳️ Hệ thống Biểu quyết Trực tuyến**: Xây dựng module biểu quyết bảo mật ngay trong ứng dụng, cho phép đại biểu thực hiện quyền biểu quyết bằng QR code hoặc mã định danh cá nhân một cách nhanh chóng và minh bạch.

---
**Thiết kế & Phát triển bởi:** Ban Thanh niên Công an tỉnh Phú Thọ.
