# Business Requirement Document - Hệ thống Quản lý Chatbot Multi-tenancy 

## 1. Tổng quan
### 1.1. Mục đích
Xây dựng hệ thống quản lý chatbot cho phép người dùng tạo, quản lý và tùy chỉnh các chatbot của họ một cách dễ dàng và hiệu quả.

### 1.2. Phạm vi
- Quản lý và cấu hình chatbot
- Quản lý người dùng và phân quyền
- Quản lý lịch sử hội thoại
- Tích hợp và quản lý nguồn dữ liệu
- Phân tích và báo cáo

## 2. Yêu cầu chức năng
### 2.1. Quản lý người dùng và phân quyền
- Đăng ký tài khoản
- Đăng nhập/Đăng xuất (Tích hợp Authentication Service)
- Quản lý thông tin cá nhân
- Phân quyền người dùng:
  - Super Admin: Toàn quyền quản lý hệ thống
  - Department Admin: Quản lý chatbot và người dùng trong phòng ban
  - User: Chỉ được truy cập giao diện chat

### 2.2. Quản lý Department (Phòng ban)
- Tạo mới department
- Chỉnh sửa thông tin department
- Quản lý người dùng trong department
- Xem thống kê và báo cáo theo department

### 2.3. Quản lý Chatbot
- Tạo mới chatbot
- Chỉnh sửa thông tin chatbot
- Xóa chatbot
- Kích hoạt/Vô hiệu hóa chatbot
- Cấu hình prompt:
  - System Prompt
  - Condense Prompt
- Cấu hình LLM:
  - StopSequence
  - Temperature
  - TopK
  - Các tham số khác của mô hình
- Quản lý datasource cho chatbot

### 2.4. Quản lý Datasource
- Cấu trúc dữ liệu phân cấp:
  - Datasource (Collection của documents)
  - Document (File hoặc URL)
  - Chunk_text (Đoạn văn bản đã được xử lý)
- Hỗ trợ các loại nguồn dữ liệu:
  - Files: PDF, DOCX, TXT
  - URLs: Website links
- Chức năng quản lý:
  - Tải lên nhiều tài liệu
  - Thêm/xóa URL
  - Xử lý và phân đoạn văn bản
  - Cập nhật và xóa datasource

### 2.5. Quản lý hội thoại
- Xem lịch sử hội thoại
- Tìm kiếm hội thoại
- Xuất báo cáo hội thoại
- Phân tích nội dung hội thoại

### 2.6. Báo cáo và thống kê
- Thống kê số lượng hội thoại
- Thống kê thời gian sử dụng
- Báo cáo hiệu suất chatbot
- Phân tích feedback người dùng

## 3. Yêu cầu phi chức năng
### 3.1. Hiệu năng
- Thời gian phản hồi < 2 giây
- Hỗ trợ đồng thời nhiều người dùng
- Khả năng mở rộng linh hoạt

### 3.2. Bảo mật
- Mã hóa dữ liệu người dùng
- Xác thực hai lớp
- Kiểm soát truy cập
- Ghi log hệ thống

### 3.3. Giao diện người dùng
- Thân thiện, dễ sử dụng
- Responsive design
- Hỗ trợ đa ngôn ngữ
- Tương thích đa trình duyệt

## 5. Yêu cầu triển khai
### 5.1. Môi trường
- Web-based application
- Cloud hosting
- CI/CD pipeline

### 5.2. Công nghệ
- Frontend: Next, React
- Backend: Node.js (Unified backend/frontend)
- Database: 
  - Supabase (Primary database)
  - MongoDB (Message Chat)
- Cache: Redis
- Storage: Lưu trên supabase
