# Trình tạo QR chúc 20/10

Một trang tĩnh đơn giản tạo thiệp có mã QR chứa lời chúc hoặc URL cho ngày 20/10 (Ngày Phụ nữ Việt Nam).

Nội dung:
- `index.html` – trang chính
- `styles.css` – kiểu dáng
- `script.js` – logic tạo QR và ghép thiệp

Mở bằng trình duyệt: mở `d:\test\index.html` bằng trình duyệt web (kéo thả hoặc mở file). Hoặc chạy một server tĩnh nếu muốn (ví dụ Python):

```powershell
# trong thư mục d:\test
python -m http.server 8000
# sau đó truy cập http://localhost:8000
```

Ghi chú:
- Sử dụng thư viện `qrcode` từ CDN.
- Nhấn "Tạo QR" để sinh mã, sau đó nhấn "Tải ảnh" để tải thiệp dưới dạng PNG.
 - Nhấn "Tạo QR" để sinh mã, sau đó nhấn "Tải ảnh" để tải thiệp dưới dạng PNG.
 - Nếu bạn muốn gửi riêng mã QR (để bạn bè quét bằng điện thoại), dùng tùy chọn "Tải QR (ảnh riêng)" và chọn kích thước 1024 hoặc 2048 để đảm bảo độ phân giải cao. Gửi ảnh PNG đó qua tin nhắn — điện thoại sẽ dễ quét hơn.
