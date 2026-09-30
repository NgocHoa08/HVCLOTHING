# HVCLOTHINGS

## Đơn hàng và email đăng ký

- Checkout lưu thông tin nhận hàng, mặt hàng, tổng tiền và phương thức thanh toán vào collection Firestore `orders` trước khi báo đặt hàng thành công.
- Form bản tin lưu email vào collection `newsletterSubscribers`. Hiện tại hệ thống lưu danh sách, chưa gửi email xác nhận/chiến dịch tự động.
- Admin xem đơn hàng và cập nhật trạng thái tại tab **Đơn hàng**; tab **Email đăng ký** hiển thị danh sách và tải CSV.
- Deploy cập nhật Firestore Security Rules sau khi pull code: `npx.cmd firebase-tools deploy --only firestore:rules --project hv-clothings`.
- Rules cho khách tạo order/subscription nhưng chỉ UID có document trong `admins/{uid}` mới được đọc/quản lý các bản ghi này.

Đơn hàng hiện ghi dữ liệu từ trình duyệt để quản lý COD/chuyển khoản/thẻ. Chưa tích hợp cổng thanh toán; trước khi chạy bán hàng thật nên chuyển xác thực giá/tồn kho và tạo đơn sang backend tin cậy (Cloud Functions), không xem tổng tiền gửi từ trình duyệt là dữ liệu đã xác thực.