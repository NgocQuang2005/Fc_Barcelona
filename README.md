# FC Barcelona Manager ⚽

Trang web quản lý câu lạc bộ bóng đá FC Barcelona với đầy đủ tính năng.

## 🚀 Tính năng

- **Trang chủ**: Hiển thị tin tức, huyền thoại, lịch thi đấu
- **Trận đấu**: Quản lý lịch thi đấu và kết quả
- **Đội hình**: Danh sách cầu thủ theo vị trí
- **Thống kê**: Biểu đồ thống kê giải đấu và cầu thủ
- **Huyền thoại**: Giới thiệu các huyền thoại CLB
- **Tin tức**: Tin tức mới nhất về câu lạc bộ
- **Admin**: Quản trị toàn bộ dữ liệu

## 📁 Cấu trúc thư mục

```
FC_Barcelona/
├── index.html          # Trang chủ
├── matches.html        # Trang trận đấu
├── squad.html          # Trang đội hình
├── stats.html          # Trang thống kê
├── legends.html        # Trang huyền thoại
├── news.html           # Trang tin tức
├── admin.html          # Trang quản trị
├── css/
│   └── style.css       # CSS chung
└── js/
    ├── storage.js      # Quản lý dữ liệu localStorage
    ├── utils.js        # Các hàm tiện ích
    ├── pages/          # JavaScript từng trang
    │   ├── home.js
    │   ├── matches.js
    │   ├── squad.js
    │   ├── stats.js
    │   ├── legends.js
    │   └── news.js
    └── admin/
        └── admin.js    # Module quản trị
```

## 🌐 Deploy lên GitHub Pages

### Bước 1: Push code lên GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/FC_Barcelona.git
git push -u origin main
```

### Bước 2: Bật GitHub Pages

1. Vào repository trên GitHub
2. Vào **Settings** → **Pages**
3. Chọn **Source**: GitHub Actions
4. Workflow `deploy.yml` sẽ tự động chạy

### Bước 3: Truy cập website

Sau khi deploy thành công, truy cập:
```
https://your-username.github.io/FC_Barcelona/
```

## 💾 Lưu trữ dữ liệu

- Dữ liệu được lưu trong **localStorage** của trình duyệt
- Mỗi người dùng có dữ liệu riêng trên máy của họ
- Xóa cache/cookies sẽ mất dữ liệu đã lưu

## 🎨 Tính năng giao diện

- **Dark/Light mode**: Chuyển đổi giao diện sáng/tối
- **Responsive**: Tối ưu cho mọi thiết bị
- **Animations**: Hiệu ứng mượt mà
- **Modal dialogs**: Xem chi tiết các mục

## 🔧 Công nghệ sử dụng

- **HTML5** - Cấu trúc trang
- **CSS3** - Giao diện
- **Vanilla JavaScript** - Logic và tương tác
- **localStorage API** - Lưu trữ dữ liệu
- **Canvas API** - Biểu đồ thống kê

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

---

**Mes Que Un Club** ⚽🔴🔵
