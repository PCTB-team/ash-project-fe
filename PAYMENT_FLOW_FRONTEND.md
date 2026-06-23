# Luồng Thanh Toán (Payment Flow) Dưới Góc Độ Front-End

Tài liệu này mô tả chi tiết trải nghiệm người dùng (UX) và luồng xử lý dữ liệu (Data Flow) trên Front-End khi tích hợp với cổng thanh toán PayOS.

## 1. Màn hình chọn gói (Payment Screen)
- **Vị trí:** `/dashboard/payment`
- **UI/UX:** Giao diện tối giản giống ChatGPT. Chứa nút Toggle (Chuyển đổi) giữa Gói Tháng và Gói Năm.
- **Logic:** 
  - Gọi API `GET /payment/available-plans` để hiển thị các gói có dung lượng **lớn hơn** dung lượng hiện tại.
  - Gọi API `GET /payment/my-storage` để hiển thị phần trăm dung lượng đang dùng một cách nhỏ gọn phía trên.
  - **Lưu ý:** Nếu người dùng đã sở hữu gói cao nhất, UI sẽ ẩn tất cả các gói và hiển thị thông báo "Bạn đang dùng gói cao nhất".

## 2. Khi Click "Nâng cấp ngay"
- **UI:** Nút sẽ hiện Loading spinner để tránh tình trạng người dùng click đúp (Double-click).
- **Ngầm bên dưới (Logic):** 
  - Tạo một mã UUID làm `Idempotency-Key` để gửi kèm header.
  - Gọi API `POST /payment/checkout?planId=...`.
  - Backend trả về `checkoutUrl` và `transactionId`.
  - FE lưu `transactionId` vào `localStorage` (để dùng cho màn hình Success sau này).
- **Chuyển hướng (Redirect):** FE dùng `window.location.href = checkoutUrl` để đẩy người dùng sang trang web của PayOS.

## 3. Tại trang của cổng thanh toán (PayOS)
- Người dùng tiến hành quét mã QR hoặc nhập thông tin thẻ.
- Bước này FE của dự án không can thiệp, hoàn toàn do hệ thống của PayOS xử lý.

## 4. Xử lý Callback (Khi PayOS trả user về lại App)

### Kịch bản 1: Thanh toán thành công (Thực tế là Đang xử lý)
- **UI Redirect:** Người dùng bị đẩy về trang `https://ash-project-fe.vercel.app/payment/success`.
- **Trạng thái POLLING (Đang xác nhận):** 
  - Do có độ trễ giữa việc user quay về App và Webhook của PayOS báo cho Backend, FE không được kết luận thành công ngay.
  - Màn hình sẽ hiện vòng xoay (Loader) và dòng chữ "Đang xác nhận giao dịch...".
  - FE tự động móc `transactionId` từ `localStorage` ra và gọi API `GET /payment/status/{transactionId}` mỗi 3 giây một lần (Polling).
- **Trạng thái SUCCESS (Thành công):**
  - Khi Backend trả về status `SUCCESS`, vòng xoay biến mất.
  - UI nổ pháo hoa (Confetti effect), hiện dấu tick xanh thông báo nâng cấp thành công.

### Kịch bản 2: Người dùng bấm Huỷ trên PayOS
- **UI Redirect:** Người dùng bị đẩy về trang `https://ash-project-fe.vercel.app/payment/cancel`.
- **Trạng thái CANCEL:** Hiển thị thông báo nhẹ nhàng "Đã huỷ thanh toán" và cung cấp nút để quay lại xem các gói khác hoặc về Dashboard.

## 5. Cập nhật hệ thống sau khi thanh toán (Trở lại Dashboard)
Khi người dùng từ màn hình Success nhấn "Về Dashboard", React Router sẽ kích hoạt Layout Dashboard (nơi chứa Header và Sidebar).
- **Sidebar (Góc dưới bên trái):** Layout sẽ tự động gọi lại hàm `fetchProfile` và `getStorageUsage`. Thanh Progress bar dung lượng sẽ lập tức co ngắn lại (Ví dụ: Từ 98% đỏ loét tụt xuống 5% xanh lá do tổng dung lượng đã được mở rộng).
- **Trải nghiệm liền mạch:** Không cần người dùng F5 (Refresh) trang. Họ có thể lập tức vào mục Trợ lý AI hoặc Nhóm học tập để tải lên các tài liệu nặng mà không còn bị chặn bởi lỗi 400 (hết dung lượng).
