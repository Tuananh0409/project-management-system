# Tài liệu kiến trúc phần mềm (Software Architect)
1# Phần mềm Quản lý dự án & Công việc nội bộ

> **Phiên bản** 1.0
> **Ngày tạo** 04/05/2026
> **Tác giả** Tuan Minh, Tuan Anh
> **Trạng thái** Draft
> **Phân loại** Nội bộ - Bảo mật

---

## Mục lục

1.Tổng quan tài liệu
2.Phạm vi
3.
4.

## 1. Tổng quan tài liệu

### 1.1. Giới thiệu
Trong bối cảnh công ty đang mở rộng quy mô, việc tối ưu hóa quy trình làm việc và quản trị dữ liệu trở thành yếu tố then chốt để duy trì hiệu quả vận hành. Hiện tại, các đội ngũ đang dựa trên các công cụ rời rạc như spreadsheet và email để theo dõi dự án. Tuy nhiên, mô hình quản lý truyền thống này đang bộc lộ những hạn chế đáng kể, không còn đáp ứng được nhu cầu phối hợp đa bộ phận trong kỷ nguyên số hóa

Việc chuyển đổi sang một nền tảng quản trị tập trung không chỉ là nhu cầu cấp thiết để minh bạch hóa thông tin mà còn là nền tảng để xây dựng văn hóa làm việc chuyên nghiệp, giúp công ty phát triển bền vững.

### 1.2. Mục đích
#### 1.2.1. Xác định vấn đề
Mặc dù spreadsheet và email là những công cụ phổ biến, việc sử dụng chúng làm công cụ quản lý dự án chính đang gây ra nhiều hệ lụy cho công ty:
Thiếu minh bạch: Các bên liên quan gặp khó khăn trong việc nắm bắt trạng thái thực tế của dự án theo thời gian thực.
Khó phối hợp: Việc theo dõi qua email dẫn đến sự chậm trễ trong phản hồi và thiếu sự đồng bộ giữa các nhóm.
Dữ liệu phân mảnh: Thông tin dự án bị lưu trữ rời rạc ở nhiều nơi, nhiều công cụ và bộ phận khác nhau, gây khó khăn cho việc tra cứu.
Mất dấu tổng thể: Không có cái nhìn bao quát về tiến độ chung của toàn công ty cũng như sự liên kết giữa các dự án.
Quản lý nguồn lực không hiệu quả: Cấp quản lý thiếu công cụ để kiểm soát tải công việc và hiệu quả thực tế của từng nhân sự.

#### 1.2.2. Mục tiêu

Hệ thống quản lý dự án nội bộ nhằm cung cấp cho ban quản lý và các đội ngũ một công cụ hiện đại để chuẩn hóa quy trình làm việc. Mục tiêu cuối cùng là trang bị cho công ty một công nghệ cắt gỡ các rào cản về thông tin, tăng cường khả năng phối hợp và thúc đẩy sự phát triển của doanh nghiệp

Thông qua hệ thống này, các cấp quản lý sẽ có thông tin chính xác và kịp thời để đưa ra các quyết định điều phối nguồn lực quan trọng. Tài liệu này sẽ mô tả kiến trúc của hệ thống, các quyết định thiết kế giúp hiện thực hóa các mục tiêu quản trị nêu trên.

## 2. Tổng quan hệ thống
### 2.1. Giới thiệu chức năng
Phần mềm quản lý dự án giúp: 
Quản lý Project, milestone, task.
Phân công task cho member, theo dõi tiến độ và thời gian làm việc.
Dashboard KPI, báo cáo theo dự án, team.

### 2.2. Phạm vi hệ thống
#### 2.2.1. Trong phạm vi
| # | Hạng mục | Mô tả |
|---|----------|-------|
| S1 | Workspace nội bộ | Thiết lập không gian làm việc số hóa riêng biệt cho từng phòng ban, đảm bảo tính bảo mật và chuyên biệt. |
| S2 | Quản lý dự án tập trung | Khởi tạo và quản lý hồ sơ dự án, cho phép liên kết dữ liệu từ các hệ thống và bộ phận khác nhau trong công ty. |
| S3 | Milestone & Task | Cơ chế chia nhỏ dự án thành các giai đoạn và tác vụ cụ thể, gán nhân sự phụ trách và theo dõi trạng thái. |
| S4 | Theo dõi tiến độ | Hệ thống giám sát thời gian thực về tiến độ công việc, giúp loại bỏ sự thiếu minh bạch trong phối hợp. |
| S5 | Công cụ quản trị | Cung cấp các Dashboard và báo cáo trực quan để quản lý kiểm soát hiệu quả công việc và nguồn lực. |

#### 2.2.2. Ngoài phạm vi
| # | Hạng mục | Lý do |
| S1 | Tích hợp sâu bên thứ ba | Vẫn đang trong giai đoạn khảo sát yêu cầu và cần thống nhất giao thức kết nối với các bộ phận liên quan. | 
| S2 | Quản trị tài chính dự án | Ưu tiên hoàn thiện các tính năng quản lý tiến độ cốt lõi trước khi mở rộng sang module kế toán phức tạp. |
| S3 | Biểu đồ luồng chi tiết | Thiếu hụt các phiên thảo luận chuyên sâu với Stakeholders để xác định mọi trường hợp nghiệp vụ nhỏ nhất. |
| S4 | Tự động hóa báo cáo nâng cao | Yêu cầu một hệ thống phân tích dữ liệu (Analytics) riêng biệt, dự kiến sẽ được phát triển trong giai đoạn sau. |

## 3. Yêu cầu kiến trúc 
### 3.1. Yêu cầu chức năng chính
| # | Chức năng | Mô tả |
|---|-----------|-------|
| S! | Quản lý Workspace | Tạo, chỉnh sửa tên, mô tả, |
| S2 | Quản lý Project | Tạo, chỉnh sửa, xem chi tiết dự án, milestone. |
| S3 | Quản lý task | tạo task, gán người thực hiện, phụ thuộc, deadline, Gantt. |
| S4 | Quản lý tài nguyên và timesheet | phân bổ nhân lực, ghi log thời gian làm việc. |
| S5 | Báo cáo & dashboard | KPI, progress chart, export PDF/Excel. |
| S6 | Notification | cảnh báo deadline, thay đổi trạng thái task, review request. |

### 3.2. Yêu cầu phi chức năng
| # | Yêu cầu | Mô tả |
|---|---------|-------|
| S1 | Hiệu năng | Hỗ trợ 500–1000 user nội bộ, 95% response < 2s.  |   
| S2 | Bảo mật | SSO nội bộ, JWT, RBAC, không lưu mật khẩu trần. |
| S3 |  Khả năng mở | Dễ thêm module (risk, portfolio, resource planning). |
| S4 |  Tích hợp  | API REST, Kafka, Redis cho realtime, cache. |
| S5 | Ngôn ngữ |  Tiếng Việt chính, cấu hình đa ngôn ngữ. |

## 4. Kiến trúc tổng thể
### 4.1. Mô hình kiến trúc
Front-end: ReactJs(Single Page Application), Responsive.
Back-end: Spring boot(Java), REST API với:
-Authentication/Authorization: JWT + RBAC.
-Business logic: xử lý dự án, task, budget, reporting.
Database: PostgreSQL cho dữ liệu chính
Message & Cache:
- Kafka: dùng cho event log, notification, background job
- Redis: cache dữ liệu thường dùng (dashboard, danh sách dự án gần đây).

### 4.2. Module chính và công nghệ
| # | Module | Công nghệ chính | Ghi chú |
|---|--------|-----------------|---------|
| S1 | Front-end | ReactJS, TypeScript | Giao diện quản lý dự án, task, dashboard. |
| S2 | Back-end API | Spring Boot (Java) | Xử lý REST API, business logic, validation. | 
| S3 | Authentication | Spring Security + JWT | RBAC, role: Admin, PMO, PM, Member. |
| S4 | Project Management | Spring Boot + PostgreSQL | Lưu dự án, milestone, WBS, deliverables |
| S5 | Task & Workload | Spring Boot + PostgreSQL + Kafka | Event task change, Gantt, notification. |
| S6 | Resource & Timesheet | Spring Boot + PostgreSQL | Quản lý nhân lực, timesheet, capacity. |
| S7 | Budget & Finance | Spring Boot + PostgreSQL | Quản lý ngân sách, chi phí, đối chiếu. |
| S8 | Reporting & Dashboard | Spring Boot + PostgreSQL + Redis | Cache KPI, dashboard, báo cáo. |
| S9 | Notification Service | Kafka + Worker (Spring Boot) | Gửi email, push notification, chat nội bộ. |

### 4.3. Kiến trúc dữ liệu
Bảng chính: projects, milestones, tasks, users, teams, resource_assignments, time_logs, budget_lines, reports.
Tối ưu: 
Index các cột thường filter: project_id, assignee_id, status, deadline.
Soft delete cho record quan trọng (có trường deleted_at).

## 5. Kiến trúc vật lý và triển khai nội bộ
### 5.1. Môi trường triển khai 
- Mạng: **Intranet nội bộ**, server on‑premise hoặc private cloud.
- Server:
  - Frontend: Nginx serving ReactJS build.
  - Backend: Spring Boot (Docker container) chạy dưới reverse proxy.
  - PostgreSQL cluster: primary + replica read.
  - Kafka cluster: mấy node, dùng cho event task, notification.
  - Redis: deployed cluster / sentinel, dùng cache & session.
- Client:
  - Web browser nội bộ (Chrome, Edge, Firefox).
  - (Tùy chọn) PWA cho mobile.

  ### 5.2. Sơ đồ triển khai 
  - User (Browser) → Nginx → ReactJS static files  
- ReactJS → Call API (Spring Boot) → PostgreSQL  
- Spring Boot → Produce event → Kafka → Notification Service → Email / Chat  
- Redis cache: dashboard, danh sách project gần đây, KPI.

## 6. Kiến trúc động và hành vi hệ thống
### 6.1. Luồng xử lý chính
User đăng nhập qua SSO, hệ thống cấp JWT.
PM tạo dự án, milestone, task trên frontend (ReactJS).
Frontend gọi API Spring Boot lưu vào PostgreSQL.
Backend sinh event → gửi lên Kafka:
task.created, task.updated, task.completed.
Notification Service consume Kafka → gửi email / chat nội bộ.
User nhập timesheet → Spring Boot lưu vào PostgreSQL, cập nhật dashboard.

### 6.2. Sequence 
actor User
User -> Frontend : login
Frontend -> Backend : POST /auth/login (JWT)
User -> Frontend : create_task
Frontend -> Backend : POST /tasks
Backend -> DB : INSERT tasks
Backend -> Kafka : PRODUCE task.created
Kafka -> NotificationService : CONSUME task.created
NotificationService -> Email : SEND notification


---

## 7. Các quyết định kiến trúc (ADR – dùng stack của bạn)

| ID | Nộidung | Lý do chọn |
|----|---------|------------|
| ADR‑001  | Frontend: ReactJS SPA | UX tốt, dễ maintain, nhiều dev quen thuộc. |
| ADR‑002  | Backend: Spring Boot (Java) | Ready ecosystem, dễ scale, bind với PMO logic. |
| ADR‑003  | Database: PostgreSQL | ACID, quen thuộc, hỗ trợ JSON, dễ backup. |
| ADR‑004  | Message: Kafka cho event & notification | Stream event, decouple, dễ monitor. |
| ADR‑005  | Cache & Session: Redis | Nhanh, support cache, session, rate limit. |
| ADR‑006  | Không dùng microservices full (hiện tại) | Quy mô nội bộ vừa, dễ vận hành DevOps. |

## 8. Chất lượng hệ thống
### 8.1. Bảo mật
Token: JWT, hết hạn (ví dụ 15–30 phút).
Role: Admin, PMO, PM, Member, mỗi role có quyền riêng.
Dữ liệu nhạy cảm (chi phí, KPI, user) không được expose public.
Audit log: tất cả thay đổi quan trọng (create/update/delete project/task).

### 8.2. Hiệu suất và khả năng mở rộng
Short-term: 500-1000 user nội bộ, 95% response < 2s
Long-term: 
Có thể tách module reporting thành service riêng
Dùng Kafka để scale horizontally cho notification & event

