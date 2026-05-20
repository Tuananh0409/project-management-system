-- CTEL PM — initial schema from docs/ERD2.md

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL,
    username        VARCHAR(100) NOT NULL,
    password_hash   VARCHAR(255),
    status          VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE TABLE workspace_roles (
    id              BIGSERIAL PRIMARY KEY,
    role_name       VARCHAR(50)  NOT NULL,
    permissions     TEXT,
    CONSTRAINT uq_workspace_roles_role_name UNIQUE (role_name)
);

CREATE TABLE project_roles (
    id              BIGSERIAL PRIMARY KEY,
    role_name       VARCHAR(50)  NOT NULL,
    permissions     TEXT,
    CONSTRAINT uq_project_roles_role_name UNIQUE (role_name)
);

CREATE TABLE project_status (
    id              BIGSERIAL PRIMARY KEY,
    status_name     VARCHAR(50)  NOT NULL,
    color_code      VARCHAR(20),
    CONSTRAINT uq_project_status_name UNIQUE (status_name)
);

CREATE TABLE project_priorities (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(50)  NOT NULL,
    weight          INT          NOT NULL DEFAULT 0,
    color_code      VARCHAR(20),
    CONSTRAINT uq_project_priorities_name UNIQUE (name)
);

CREATE TABLE task_status (
    id              BIGSERIAL PRIMARY KEY,
    status_name     VARCHAR(50)  NOT NULL,
    position        INT          NOT NULL DEFAULT 0,
    color_code      VARCHAR(20),
    CONSTRAINT uq_task_status_name UNIQUE (status_name)
);

CREATE TABLE workspaces (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    code            VARCHAR(50)  NOT NULL,
    slug            VARCHAR(150) NOT NULL,
    logo_url        VARCHAR(500),
    owner_id        BIGINT       NOT NULL REFERENCES users (id),
    privacy_mode    VARCHAR(20)  NOT NULL DEFAULT 'PRIVATE',
    theme_color     VARCHAR(20),
    status          VARCHAR(20)  NOT NULL DEFAULT 'active',
    timezone        VARCHAR(64)  NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    is_deleted      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_workspaces_name UNIQUE (name),
    CONSTRAINT uq_workspaces_code UNIQUE (code),
    CONSTRAINT uq_workspaces_slug UNIQUE (slug)
);

CREATE INDEX idx_workspaces_owner_id ON workspaces (owner_id);
CREATE INDEX idx_workspaces_status ON workspaces (status) WHERE is_deleted = FALSE;

CREATE TABLE workspace_members (
    id              BIGSERIAL PRIMARY KEY,
    workspace_id    BIGINT       NOT NULL REFERENCES workspaces (id),
    user_id         BIGINT       NOT NULL REFERENCES users (id),
    role_id         BIGINT       NOT NULL REFERENCES workspace_roles (id),
    joined_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_workspace_members_workspace_user UNIQUE (workspace_id, user_id)
);

CREATE INDEX idx_workspace_members_user_id ON workspace_members (user_id);

CREATE TABLE workspace_invitations (
    id              BIGSERIAL PRIMARY KEY,
    workspace_id    BIGINT       NOT NULL REFERENCES workspaces (id),
    email           VARCHAR(255) NOT NULL,
    inviter_id      BIGINT       NOT NULL REFERENCES users (id),
    role_id         BIGINT       NOT NULL REFERENCES workspace_roles (id),
    status          VARCHAR(20)  NOT NULL DEFAULT 'pending',
    token           VARCHAR(64)  NOT NULL,
    expired_at      TIMESTAMPTZ  NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_workspace_invitations_token UNIQUE (token)
);

CREATE INDEX idx_workspace_invitations_workspace_id ON workspace_invitations (workspace_id);
CREATE INDEX idx_workspace_invitations_email ON workspace_invitations (email);

CREATE TABLE projects (
    id              BIGSERIAL PRIMARY KEY,
    workspace_id    BIGINT       NOT NULL REFERENCES workspaces (id),
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(50)  NOT NULL,
    slug            VARCHAR(150) NOT NULL,
    description     TEXT,
    pm_id           BIGINT       REFERENCES users (id),
    status_id       BIGINT       REFERENCES project_status (id),
    privacy_mode    VARCHAR(20)  NOT NULL DEFAULT 'PRIVATE',
    color_code      VARCHAR(20),
    start_date      TIMESTAMPTZ,
    end_date        TIMESTAMPTZ,
    is_deleted      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_projects_code UNIQUE (code),
    CONSTRAINT uq_projects_slug UNIQUE (slug),
    CONSTRAINT uq_projects_workspace_name UNIQUE (workspace_id, name)
);

CREATE INDEX idx_projects_workspace_id ON projects (workspace_id);
CREATE INDEX idx_projects_pm_id ON projects (pm_id);
CREATE INDEX idx_projects_status_id ON projects (status_id);

CREATE TABLE project_members (
    id              BIGSERIAL PRIMARY KEY,
    project_id      BIGINT       NOT NULL REFERENCES projects (id),
    user_id         BIGINT       NOT NULL REFERENCES users (id),
    role_id         BIGINT       NOT NULL REFERENCES project_roles (id),
    joined_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_members_project_user UNIQUE (project_id, user_id)
);

CREATE INDEX idx_project_members_user_id ON project_members (user_id);

CREATE TABLE project_attachments (
    id              BIGSERIAL PRIMARY KEY,
    project_id      BIGINT       NOT NULL REFERENCES projects (id),
    file_name       VARCHAR(255) NOT NULL,
    file_path       VARCHAR(1000) NOT NULL,
    file_type       VARCHAR(50),
    file_size       BIGINT       NOT NULL,
    uploaded_by     BIGINT       NOT NULL REFERENCES users (id),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_attachments_project_id ON project_attachments (project_id);

CREATE TABLE milestones (
    id              BIGSERIAL PRIMARY KEY,
    project_id      BIGINT       NOT NULL REFERENCES projects (id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    due_date        TIMESTAMPTZ,
    status          VARCHAR(20)  NOT NULL DEFAULT 'pending',
    is_deleted      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_milestones_project_name UNIQUE (project_id, name)
);

CREATE INDEX idx_milestones_project_id ON milestones (project_id);
CREATE INDEX idx_milestones_due_date ON milestones (due_date);

CREATE TABLE tasks (
    id              BIGSERIAL PRIMARY KEY,
    project_id      BIGINT       NOT NULL REFERENCES projects (id),
    milestone_id    BIGINT       REFERENCES milestones (id),
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    priority        VARCHAR(20)  NOT NULL DEFAULT 'Medium',
    status_id       BIGINT       REFERENCES task_status (id),
    deadline        TIMESTAMPTZ,
    created_by      BIGINT       NOT NULL REFERENCES users (id),
    is_deleted      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_project_id ON tasks (project_id);
CREATE INDEX idx_tasks_milestone_id ON tasks (milestone_id);
CREATE INDEX idx_tasks_status_id ON tasks (status_id);
CREATE INDEX idx_tasks_created_by ON tasks (created_by);
CREATE INDEX idx_tasks_deadline ON tasks (deadline);

CREATE TABLE task_assignees (
    id              BIGSERIAL PRIMARY KEY,
    task_id         BIGINT       NOT NULL REFERENCES tasks (id),
    user_id         BIGINT       NOT NULL REFERENCES users (id),
    CONSTRAINT uq_task_assignees_task_user UNIQUE (task_id, user_id)
);

CREATE INDEX idx_task_assignees_user_id ON task_assignees (user_id);

CREATE TABLE task_comments (
    id              BIGSERIAL PRIMARY KEY,
    task_id         BIGINT       NOT NULL REFERENCES tasks (id),
    user_id         BIGINT       NOT NULL REFERENCES users (id),
    content         TEXT         NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_comments_task_id ON task_comments (task_id);

CREATE TABLE task_attachments (
    id              BIGSERIAL PRIMARY KEY,
    task_id         BIGINT       NOT NULL REFERENCES tasks (id),
    file_name       VARCHAR(255) NOT NULL,
    file_path       VARCHAR(1000) NOT NULL,
    file_size       BIGINT       NOT NULL,
    file_type       VARCHAR(50),
    uploaded_by     BIGINT       NOT NULL REFERENCES users (id),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_attachments_task_id ON task_attachments (task_id);

CREATE TABLE task_history (
    id              BIGSERIAL PRIMARY KEY,
    task_id         BIGINT       NOT NULL REFERENCES tasks (id),
    changed_by      BIGINT       NOT NULL REFERENCES users (id),
    field_name      VARCHAR(100) NOT NULL,
    old_value       TEXT,
    new_value       TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_history_task_id ON task_history (task_id);

CREATE TABLE project_snapshots (
    id                  BIGSERIAL PRIMARY KEY,
    project_id          BIGINT       NOT NULL REFERENCES projects (id),
    snapshot_date       DATE         NOT NULL,
    total_tasks         INT          NOT NULL DEFAULT 0,
    completed_tasks     INT          NOT NULL DEFAULT 0,
    overdue_tasks       INT          NOT NULL DEFAULT 0,
    remaining_tasks     INT          NOT NULL DEFAULT 0,
    completion_rate     REAL         NOT NULL DEFAULT 0,
    CONSTRAINT uq_project_snapshots_project_date UNIQUE (project_id, snapshot_date)
);

CREATE TABLE user_productivity_logs (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT       NOT NULL REFERENCES users (id),
    project_id          BIGINT       NOT NULL REFERENCES projects (id),
    log_date            DATE         NOT NULL,
    tasks_assigned      INT          NOT NULL DEFAULT 0,
    tasks_completed     INT          NOT NULL DEFAULT 0,
    overdue_tasks       INT          NOT NULL DEFAULT 0,
    hours_logged        REAL         NOT NULL DEFAULT 0,
    CONSTRAINT uq_user_productivity_logs_user_project_date UNIQUE (user_id, project_id, log_date)
);

CREATE INDEX idx_user_productivity_logs_project_id ON user_productivity_logs (project_id);
