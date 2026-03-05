# 🚀 HƯỚNG DẪN DEPLOY LÊN GITHUB PAGES

## Bước 1: Khởi tạo Git (nếu chưa có)

```bash
git init
git config user.name "Tên của bạn"
git config user.email "email@example.com"
```

## Bước 2: Tạo repository trên GitHub

1. Truy cập https://github.com/new
2. Đặt tên repository: `FC_Barcelona` (hoặc tên khác)
3. **KHÔNG chọn** "Add a README file"
4. Click **Create repository**

## Bước 3: Push code lên GitHub

Sau khi tạo repository, chạy các lệnh sau:

```bash
# Thêm tất cả file
git add .

# Commit
git commit -m "Initial commit: FC Barcelona Manager"

# Đổi branch thành main
git branch -M main

# Thêm remote (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/FC_Barcelona.git

# Push lên GitHub
git push -u origin main
```

## Bước 4: Bật GitHub Pages

1. Vào repository trên GitHub
2. Click tab **Settings**
3. Kéo xuống phần **Pages** (menu bên trái)
4. Tại **Source**, chọn: **GitHub Actions**
5. Workflow sẽ tự động chạy

## Bước 5: Kiểm tra Deploy

1. Click tab **Actions** trên repository
2. Chờ workflow "Deploy to GitHub Pages" chạy xong (màu xanh ✅)
3. Truy cập website:
   ```
   https://YOUR_USERNAME.github.io/FC_Barcelona/
   ```

## 🔧 Nếu gặp lỗi

### Lỗi: "The job was not acquired by Runner"
- Đây là lỗi của GitHub, không phải code
- **Giải pháp**: Chờ vài phút và re-run workflow:
  - Vào tab **Actions**
  - Click vào workflow bị lỗi
  - Click nút **Re-run all jobs**

### Lỗi 404 khi truy cập website
- **Nguyên nhân**: Workflow chưa chạy xong hoặc Pages chưa được bật
- **Giải pháp**:
  1. Vào Settings → Pages
  2. Kiểm tra đã chọn Source: **GitHub Actions**
  3. Đợi workflow chạy xong (tab Actions)

### Lỗi: "Permission denied"
- **Giải pháp**:
  1. Vào Settings → Actions → General
  2. Kéo xuống "Workflow permissions"
  3. Chọn **Read and write permissions**
  4. Click **Save**
  5. Re-run workflow

## 📱 Cập nhật sau khi deploy

Khi muốn cập nhật website:

```bash
# 1. Thêm các thay đổi
git add .

# 2. Commit
git commit -m "Mô tả thay đổi"

# 3. Push
git push

# Workflow sẽ tự động deploy lại!
```

## ✅ Checklist trước khi deploy

- [x] Đã sửa lỗi CSS backdrop-filter
- [x] Đã tạo file .github/workflows/deploy.yml
- [x] Tất cả đường dẫn file dùng relative paths
- [x] Không có lỗi cú pháp trong code
- [x] Đã test website trên local

---

**Chúc bạn deploy thành công! 🎉**
