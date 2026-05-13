```mermaid
erDiagram
    %% Quan hệ giữa các thực thể
    USERS_HRM ||--o{ WORKSPACES : "is_owner"
    USERS_HRM ||--o{ WORKSPACE_MEMBERS : "is_member"
    USERS_HRM ||--o{ WORKSPACE_INVITATIONS : "invites"
    
    WORKSPACES ||--o{ WORKSPACE_MEMBERS : "contains"
    WORKSPACES ||--o{ WORKSPACE_INVITATIONS : "has_invitations"
    WORKSPACES ||--o{ PROJECTS : "contains"

    WORKSPACE_ROLES ||--o{ WORKSPACE_MEMBERS : "defines_access"
    WORKSPACE_ROLES ||--o{ WORKSPACE_INVITATIONS : "assigns_to_future_member"

	PROJECT_STATUS ||--o{ PROJECTS : "defines_state"
    PROJECT_PRIORITIES ||--o{ PROJECTS : "defines_importance"
    PROJECTS ||--o{ PROJECT_MEMBERS : "has_team"
    PROJECT_ROLES ||--o{ PROJECT_MEMBERS : "defines_job"
    PROJECTS ||--o{ PROJECT_ATTACHMENTS : "has_files"
    PROJECTS ||--o{ MILESTONES : "has_milestones"
    PROJECTS ||--o{ TASKS : "contains"
    PROJECTS ||--o{ PROJECT_SNAPSHOTS : "has_historical_data"
    PROJECTS ||--o{ USER_PRODUCTIVITY_LOGS : "tracks_team_performance"
    
    USERS_HRM ||--o{ USER_PRODUCTIVITY_LOGS : "logs_user_productivity"

    PROJECTS ||--o{ TASKS : "contains"
    MILESTONES ||--o{ TASKS : "groups (optional)"
    
    TASK_STATUS ||--o{ TASKS : "defines_workflow"
    TASKS ||--o{ TASK_ASSIGNEES : "assigned_to"
    USERS_HRM ||--o{ TASK_ASSIGNEES : "is_assigned"
    
    TASKS ||--o{ TASK_COMMENTS : "has_discussions"
    USERS_HRM ||--o{ TASK_COMMENTS : "writes"
    
    TASKS ||--o{ TASK_ATTACHMENTS : "has_files"
    USERS_HRM ||--o{ TASK_ATTACHMENTS : "uploads"
    
    TASKS ||--o{ TASK_HISTORY : "tracks_changes"
    USERS_HRM ||--o{ TASK_HISTORY : "performs_action"


    

    %% Chi tiết các bảng
    USERS_HRM {
        int id PK "ID định danh từ hệ thống HRM công ty"
        string email "unique"
        string username
    }

    WORKSPACES {
        int id PK
        string name "unique, max 100 char (Tên phòng ban)"
        string description "Mô tả mục tiêu phòng ban"
		string code "Mã viết tắt (e.g. IT, PSM) - UNIQUE"
        string slug "URL định danh (e.g. phong-cong-nghe) - UNIQUE"
        string logo_url "Đường dẫn ảnh đại diện"
        int owner_id FK "Người tạo/chủ sở hữu Workspace"
		string privacy_mode "Public / Private / Secret"
		string theme_color "Mã màu Hex (e.g., #4A90E2)"
        string status "active/archived - Trạng thái hoạt động"
		string timezone "Múi giờ (e.g., Asia/Ho_Chi_Minh)"
        boolean is_deleted "Soft-delete flag (mặc định false)"
		datetime created_at
        datetime updated_at
    }

    WORKSPACE_MEMBERS {
        int id PK
        int workspace_id FK
        int user_id FK "Mapping từ USERS_HRM"
        int role_id FK "Liên kết đến bảng ROLES"
        datetime joined_at "Thời điểm tham gia chính thức"
    }

  	WORKSPACE_INVITATIONS {
        int id PK
        int workspace_id FK "Liên kết tới Workspace"
        string email "Email người được mời (FR-06)"
        int inviter_id FK "Mapping ID người mời từ HRM"
        int role_id FK "Quyền hạn sẽ được gán"
        string status "pending/accepted/expired/declined"
        string token "UUID hoặc Secure Token (Unique)"
        datetime expired_at "Thời điểm hết hạn (now + 48h)"
        datetime created_at "Thời điểm gửi lời mời"
        datetime updated_at "Thời điểm cập nhật trạng thái cuối"
    }

    WORKSPACE_ROLES {
        int id PK
        string role_name "Admin / Member / Viewer"
        json permissions "Chi tiết quyền hạn (JSON format)"
    }

	PROJECTS {
        int id PK
        int workspace_id FK
        string name "Tên dự án"
        string code "UNIQUE - Mã tự động (e.g. PTUD)"
		string slug "UNIQUE - Đường dẫn URL (e.g. du-an-phan-mem)"
        string description
        int pm_id FK "ID người làm PM (Chỉ định từ HRM)"
        int status_id FK "Link PROJECT_STATUS"
        string privacy_mode "Public / Private"
        string color_code "Mã màu nhận diện"
        datetime start_date
        datetime end_date
        boolean is_deleted "Soft-delete"
        datetime created_at
        datetime updated_at
    }

	PROJECT_ATTACHMENTS {
        int id PK
        int project_id FK
        string file_name
        string file_path "URL S3/Cloud storage"
        string file_type "pdf, docx, png..."
        long file_size "Dung lượng tệp"
        int uploaded_by FK "ID từ HRM"
        datetime created_at
    }

	PROJECT_PRIORITIES {
        int id PK
        string name "Urgent, High, Medium, Low"
        int weight "Trọng số sắp xếp"
        string color_code "Mã màu Hex"
    }

	PROJECT_STATUS {
        int id PK
        string status_name "In Progress, Done..."
        string color_code "Màu nhãn"
    }

	PROJECT_MEMBERS {
        int id PK
        int project_id FK
        int user_id FK "Mapping HRM"
        int role_id FK "Link PROJECT_ROLES"
    }

    PROJECT_ROLES {
        int id PK
        string role_name "PM, Lead, Member, Viewr"
        json permissions "Quyền hạn chi tiết"
    }

    MILESTONES {
        int id PK
        int project_id FK "Liên kết tới dự án"
        string name "Tên mốc (Unique trong Project)"
        string description "Mô tả mục tiêu giai đoạn"
        datetime due_date "Hạn chót (phải nằm trong Start/End Project)"
        string status "pending/completed"
        boolean is_deleted "Soft-delete"
        datetime created_at
        datetime updated_at
    }

    TASKS {
        int id PK
        int project_id FK
        int milestone_id FK "Nullable"
        string title "Bắt buộc"
        string description
        string priority "Enum: Low/Medium/High/Urgent"
        int status_id FK "Link TASK_STATUS"
        datetime deadline "Phải <= Milestone deadline"
        int created_by FK "Link USERS_HRM"
        boolean is_deleted "Default false"
        datetime created_at
        datetime updated_at
    }

    TASK_ASSIGNEES {
        int id PK
        int task_id FK
        int user_id FK "Người thực hiện"
    }

    TASK_STATUS {
        int id PK
        string status_name "Todo, In Progress, Done, Review..."
        int position "Thứ tự trong Kanban"
        string color_code
    }

    TASK_COMMENTS {
        int id PK
        int task_id FK
        int user_id FK "Người bình luận"
        text content "Hỗ trợ @mention"
        datetime created_at
    }

    TASK_ATTACHMENTS {
        int id PK
        int task_id FK
        string file_name
        string file_path "S3/Server path"
        long file_size "Max 20MB"
        string file_type
        int uploaded_by FK
        datetime created_at
    }

    TASK_HISTORY {
        int id PK
        int task_id FK
        int changed_by FK "Người thực hiện sửa"
        string field_name "Tên trường thay đổi"
        text old_value
        text new_value
        datetime created_at
    }

    PROJECT_SNAPSHOTS {
        int id PK
        int project_id FK "Liên kết dự án"
        datetime snapshot_date "Ngày ghi nhận dữ liệu (Daily)"
        int total_tasks "Tổng số task tại thời điểm đó"
        int completed_tasks "Số task đã hoàn thành"
        int overdue_tasks "Số task đã quá hạn"
        int remaining_tasks "Số task còn lại (Dùng cho Burn-down)"
        float completion_rate "Tỷ lệ hoàn thành (%)"
    }

    USER_PRODUCTIVITY_LOGS {
        int id PK
        int user_id FK "Nhân sự được đánh giá"
        int project_id FK "Dự án tham gia"
        datetime log_date "Ngày ghi nhận"
        int tasks_assigned "Số task được giao trong ngày"
        int tasks_completed "Số task hoàn thành trong ngày"
        int overdue_tasks "Số task bị quá hạn"
        float hours_logged "Tổng giờ làm việc ghi nhận (Time tracking)"
    }