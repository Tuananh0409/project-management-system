# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## Phát triển phần mềm quản lý dự án nội bộ

------------------------------------------------------------------------

# I. Tổng quan tài liệu

## 1. Mục đích tài liệu

Hệ thống phục vụ toàn bộ nhân sự trong công ty, gồm nhiều phòng ban: -
IT/Developer - Sales - Marketing - HR - Finance

Mỗi phòng ban thuộc một Workspace riêng.

## 2. Phạm vi

Bao gồm: - Workspace - Project - Milestone - Task - User & Permission

Không bao gồm: - Tài chính dự án - Tích hợp bên ngoài

## 3. Đối tượng sử dụng

Toàn bộ nhân sự công ty.

## 4. Vai trò

  STT   Role          Mô tả
  ----- ------------- ---------------
  1     Admin         Quản trị
  2     Manager       Quản lý dự án
  3     Lead          Quản lý team
  4     User          Nhân viên
  5     Stakeholder   Theo dõi

------------------------------------------------------------------------

# II. Tổng quan hệ thống

## Mô hình

Workspace → Project → Milestone → Task → User

## Flow

1.  Admin tạo workspace\
2.  Manager tạo project\
3.  Lead tạo task\
4.  User thực hiện\
5.  Manager theo dõi\
6.  Stakeholder xem báo cáo

------------------------------------------------------------------------

# III. Functional Requirements

## YC1: Workspace

### Tạo Workspace

**AC** - Tạo thành công - Validate tên - Không trùng

**API** POST /workspaces

**DB** - id - name - description

------------------------------------------------------------------------

### Thêm member

**API** POST /workspace/{id}/users

------------------------------------------------------------------------

## YC2: Project

### Tạo Project

**API** POST /project

**DB** - id - name - start_date - deadline

------------------------------------------------------------------------

## YC3: Task

### Tạo Task

POST /task

### Assign Task

PUT /task/{id}/assign

------------------------------------------------------------------------

## YC4: Task Progress

PUT /tasks/{id}

-   To do
-   In progress
-   Done

------------------------------------------------------------------------

## YC5: Dashboard

GET /dashboard

-   Progress
-   Task status
-   Overdue

------------------------------------------------------------------------

## YC6: Comment

POST /task/{id}/comments\
GET /task/{id}/comments

------------------------------------------------------------------------

# IV. Non-functional Requirements

## Security

-   Login required
-   Role-based access
-   Password encryption
-   Activity log

## Performance

-   Response \< 3s
-   Dashboard \< 5s
-   200-500 users

## Usability

-   Easy UI
-   3-5 steps/task
-   Responsive
