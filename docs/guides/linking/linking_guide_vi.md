# Cách Liên Kết Tài Khoản WhatsApp và Telegram của Bạn

**Lưu ý: Việc đề cập chéo nền tảng hiện đang trong quá trình phát triển và có thể không hoạt động chính xác. Quy trình liên kết hoạt động, nhưng thông báo đề cập giữa các nền tảng có vấn đề đã biết.**

Hướng dẫn này giải thích cách liên kết tài khoản WhatsApp và Telegram của bạn để đề cập (@thẻ) hoạt động trên cả hai nền tảng. Một khi được liên kết, việc gắn thẻ ai đó trên một nền tảng sẽ thông báo cho họ trên nền tảng kia!

## Điều Kiện Tiên Quyết

- BridgeBOT đang chạy và kết nối các nhóm WhatsApp và Telegram của bạn.
- Bạn có tài khoản trong cả hai nhóm.
- Tên ngắn của bạn được đặt (xem bên dưới).

## Bước 1: Đặt Tên Ngắn của Bạn trong Telegram

Đầu tiên, chọn một tên ngắn duy nhất (1-9 ký tự chữ số, không có khoảng trắng).

1. Chuyển đến nhóm Telegram của bạn.
2. Gửi: `/link <số-điện-thoại-của-bạn> <tênngắn>`
   - Ví dụ: `/link 1234567890 john`
   - Số điện thoại: Bao gồm mã quốc gia, không có + hoặc khoảng trắng.
3. Bot sẽ trả lời bằng xác nhận hoặc lỗi.

Tên ngắn của bạn bây giờ được liên kết với tài khoản Telegram của bạn.

## Bước 2: Liên Kết từ WhatsApp

1. Trong nhóm WhatsApp của bạn, gửi: `!iam <tênngắn>`
   - Sử dụng cùng tên ngắn từ Bước 1.
   - Ví dụ: `!iam john`

2. Bot sẽ gửi một tin nhắn riêng tư đến tài khoản Telegram của bạn yêu cầu xác nhận.

3. Trong Telegram (trò chuyện riêng với bot), trả lời: `yes`
   - Điều này phải được hoàn thành trong vòng 30 giây.

4. Bạn sẽ nhận được tin nhắn xác nhận trong cả hai ứng dụng.

## Bước 3: Kiểm Tra Liên Kết

**Lưu ý: Do các hạn chế hiện tại, việc đề cập chéo nền tảng có thể không hoạt động như mong đợi.**

- Gửi tin nhắn trong WhatsApp, gắn thẻ ai đó: `@tênngắn-của-họ`
- Nó sẽ xuất hiện trong Telegram (chức năng đề cập có thể bị hạn chế).
- Gửi tin nhắn trong Telegram, gắn thẻ ai đó: `@tênngười dùng-của-họ`
- Nó sẽ xuất hiện trong WhatsApp (chức năng đề cập có thể bị hạn chế).

## Khắc Phục Sự Cố

### "Không tìm thấy người dùng Telegram phù hợp"
- Đảm bảo tên ngắn của bạn chính xác và duy nhất.
- Kiểm tra xem người dùng Telegram đã đặt tên ngắn của họ bằng `/link` chưa.

### "Xác nhận đã hết hạn"
- Cửa sổ 30 giây đã trôi qua. Hãy thử `!iam <tênngắn>` lại.

### "Số điện thoại đã được liên kết"
- Ai đó khác đã sử dụng số đó. Sử dụng `/unlink` trước nếu cần.

### Đề cập không hoạt động
- Việc đề cập chéo nền tảng hiện đang thử nghiệm và có thể có lỗi.
- Đảm bảo cả hai người dùng đều được liên kết (liên kết hoạt động, nhưng đề cập có thể không).
- Kiểm tra nhật ký bot để tìm lỗi.
- Khởi động lại bot nếu ánh xạ không tải.

### Lệnh không hoạt động
- Đảm bảo bạn gửi lệnh đến đúng vị trí:
  - `/link` và `yes`: Trong trò chuyện riêng Telegram với bot.
  - `!iam`: Trong nhóm WhatsApp.

## Quản Lý Liên Kết của Bạn

- **Kiểm tra trạng thái**: Không có lệnh trực tiếp, nhưng hãy kiểm tra với đề cập.
- **Hủy liên kết**: Gửi `/unlink` trong trò chuyện riêng Telegram, sau đó trả lời `yes` để xác nhận.
- **Thay đổi tên ngắn**: Hủy liên kết trước, sau đó liên kết với tên ngắn mới.

## Mẹo

- **Quy tắc tên ngắn**: 1-9 ký tự, chỉ chữ cái và số.
- **Định dạng điện thoại**: 10-15 chữ số, không có ký hiệu (ví dụ: 1234567890 cho US).
- **Quyền riêng tư**: Liên kết là cần thiết để đề cập chéo nền tảng hoạt động.
- **Quản trị viên nhóm**: Đảm bảo bot có quyền đọc tin nhắn.

## Hỗ Trợ

Nếu bạn gặp vấn đề:
1. Kiểm tra lại tất cả các bước.
2. Xác minh bot đang trực tuyến: Kiểm tra xem tin nhắn có được chuyển tiếp không.
3. Liên hệ với quản trị viên nhóm hoặc kiểm tra nhật ký bot.

Bây giờ bạn có thể đề cập bạn bè một cách liền mạch giữa các nền tảng! 🎉