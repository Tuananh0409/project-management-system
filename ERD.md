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

    %% USERS
    USERS_HRM {
        int id PK
        string email
        string username
    }

    %% WORKSPACE
    WORKSPACES {
        int id PK
        string name
        string description
        string code
        string slug
        string logo_url
        int owner_id FK
        string privacy_mode
        string theme_color
        string status
        string timezone
        boolean is_deleted
        datetime created_at
        datetime updated_at
    }

    WORKSPACE_MEMBERS {
        int id PK
        int workspace_id FK
        int user_id FK
        int role_id FK
        datetime joined_at
    }

    WORKSPACE_INVITATIONS {
        int id PK
        int workspace_id FK
        string email
        int inviter_id FK
        int role_id FK
        string status
        string token
        datetime expired_at
        datetime created_at
        datetime updated_at
    }

    WORKSPACE_ROLES {
        int id PK
        string role_name
        json permissions
    }

    %% PROJECT
    PROJECTS {
        int id PK
        int workspace_id FK
        string name
        string code
        string slug
        string description
        int pm_id FK
        int status_id FK
        string privacy_mode
        string color_code
        datetime start_date
        datetime end_date
        boolean is_deleted
        datetime created_at
        datetime updated_at
    }

    PROJECT_ATTACHMENTS {
        int id PK
        int project_id FK
        string file_name
        string file_path
        string file_type
        long file_size
        int uploaded_by FK
        datetime created_at
    }

    PROJECT_PRIORITIES {
        int id PK
        string name
        int weight
        string color_code
    }

    PROJECT_STATUS {
        int id PK
        string status_name
        string color_code
    }

    PROJECT_MEMBERS {
        int id PK
        int project_id FK
        int user_id FK
        int role_id FK
    }

    PROJECT_ROLES {
        int id PK
        string role_name
        json permissions
    }