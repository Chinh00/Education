Actor: User (PĐT/TBM/SV)
Actor: Outlook
Actor: Hệ Thống

User           Outlook            Hệ Thống
|                |                   |
|----Login------>|                   | (1. Hệ thống mở trang đăng nhập Outlook)
|                |                   |
|<--Show Login-- |                   |
|---Enter info-->|                   | (2. Người dùng nhập tài khoản Outlook)
|                |                   |
|                |---Auth info-----> | (3. Hệ thống cập nhật thông tin đăng nhập)
|                |                   |
|                |<--Auth result---  |
|                |                   |
|<-----Redirect to Homepage--------  | (4. Hệ thống chuyển người đến trang chủ phù hợp)