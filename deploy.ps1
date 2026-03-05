# Script tự động deploy lên GitHub
# Cách dùng: .\deploy.ps1

Write-Host "`n🚀 FC BARCELONA MANAGER - AUTO DEPLOY" -ForegroundColor Cyan
Write-Host "======================================`n" -ForegroundColor Cyan

# Kiểm tra git đã cài chưa
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Chưa cài Git! Tải tại: https://git-scm.com/download/win" -ForegroundColor Red
    exit
}

# Kiểm tra đã init git chưa
if (-not (Test-Path ".git")) {
    Write-Host "📦 Khởi tạo Git repository..." -ForegroundColor Yellow
    git init
    
    Write-Host "`n⚙️  Cấu hình Git (nhập thông tin):" -ForegroundColor Yellow
    $userName = Read-Host "Nhập tên của bạn"
    $userEmail = Read-Host "Nhập email của bạn"
    
    git config user.name "$userName"
    git config user.email "$userEmail"
    Write-Host "✅ Đã cấu hình Git`n" -ForegroundColor Green
}

# Kiểm tra remote
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "🔗 Thêm GitHub repository:" -ForegroundColor Yellow
    Write-Host "   Vào https://github.com/new để tạo repo mới" -ForegroundColor Gray
    $repoUrl = Read-Host "`nNhập URL repository (vd: https://github.com/username/FC_Barcelona.git)"
    
    git remote add origin $repoUrl
    Write-Host "✅ Đã thêm remote`n" -ForegroundColor Green
}

# Hiển thị status
Write-Host "📋 Trạng thái file:" -ForegroundColor Yellow
git status --short

# Confirm
Write-Host "`n❓ Bạn có muốn commit và push code?" -ForegroundColor Yellow
$confirm = Read-Host "   (y/n)"

if ($confirm -ne "y") {
    Write-Host "❌ Đã hủy!" -ForegroundColor Red
    exit
}

# Add all files
Write-Host "`n📦 Thêm tất cả file..." -ForegroundColor Yellow
git add .

# Commit
$commitMsg = Read-Host "`n💬 Nhập commit message (Enter để dùng mặc định)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

git commit -m "$commitMsg"

# Đổi branch sang main
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "🔄 Đổi branch sang main..." -ForegroundColor Yellow
    git branch -M main
}

# Push
Write-Host "`n🚀 Đang push lên GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ DEPLOY THÀNH CÔNG!" -ForegroundColor Green
    Write-Host "======================================" -ForegroundColor Green
    Write-Host "`n📍 Các bước tiếp theo:" -ForegroundColor Cyan
    Write-Host "1. Vào repository trên GitHub" -ForegroundColor White
    Write-Host "2. Settings → Pages → Source: GitHub Actions" -ForegroundColor White
    Write-Host "3. Đợi workflow chạy xong (tab Actions)" -ForegroundColor White
    Write-Host "4. Truy cập: https://USERNAME.github.io/REPO_NAME/`n" -ForegroundColor White
    
    # Mở GitHub Actions
    $openBrowser = Read-Host "Mở GitHub Actions trong browser? (y/n)"
    if ($openBrowser -eq "y") {
        $repoUrl = git remote get-url origin
        $repoUrl = $repoUrl -replace "\.git$", ""
        $actionsUrl = "$repoUrl/actions"
        Start-Process $actionsUrl
    }
} else {
    Write-Host "`n❌ DEPLOY THẤT BẠI!" -ForegroundColor Red
    Write-Host "Kiểm tra lỗi ở trên và thử lại." -ForegroundColor Yellow
}

Write-Host "`nXem hướng dẫn chi tiết trong file DEPLOY.md`n" -ForegroundColor Gray
