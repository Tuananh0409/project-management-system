# CTEL PM — Frontend

React + Vite + Tailwind CSS 4.

## Chạy dev

1. Backend chạy tại `http://localhost:8080`
2. PostgreSQL: `docker compose up -d` (thư mục gốc repo)

```bash
cd pms-frontend
npm install
npm run dev
```

Mở http://localhost:5173

## Đăng nhập

- Đăng ký / đăng nhập tại `/login`, `/register`
- Dev seed: `admin@ctel.local` / `Admin@123` (sau Flyway V4)

## Tính năng

- **Tổng quan** (`/`) — dashboard thống kê đơn giản, workspace gần đây
- **Workspace** (`/workspaces`) — danh sách / tạo workspace
- Chi tiết workspace (`/workspaces/:id`), mời thành viên
- Chấp nhận lời mời: `/invitations/{token}/accept`
- Sidebar: các mục **Dự án, Kanban, …** hiện là placeholder **Sắp có** (chờ API)

## Giao diện

Sidebar trái + top bar kiểu Jira/ClickUp (`AppShell`).

## Cấu trúc thư mục

```
src/
  app/                    # App shell: providers, router
  shared/
    api/                  # HTTP client, types lỗi API
    components/
      ui/                 # Button, Modal (dùng chung)
      layout/             # AppShell, AppSidebar, AppTopBar, PageHeader
      feedback/           # Loading, Error, Empty
    config/               # navigation (sidebar)
    context/              # AuthProvider
  features/
    workspace/            # Module workspace
      api/                # workspaceApi, invitationApi
      types/
      components/
      pages/
```

Import alias: `@/` → `src/` (xem `vite.config.ts`, `tsconfig.json`).

Thêm module mới (vd. `project`): tạo `src/features/project/` với cùng pattern `api/`, `types/`, `components/`, `pages/`, rồi đăng ký route trong `src/app/router.tsx`.
