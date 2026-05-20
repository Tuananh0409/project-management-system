-- Seed lookup / role data for development

INSERT INTO workspace_roles (role_name, permissions) VALUES
    ('Admin', '{"workspace": ["read", "write", "delete", "manage_members"]}'),
    ('Member', '{"workspace": ["read", "write"]}'),
    ('Viewer', '{"workspace": ["read"]}');

INSERT INTO project_roles (role_name, permissions) VALUES
    ('PM', '{"project": ["read", "write", "delete", "manage_members", "manage_tasks"]}'),
    ('Lead', '{"project": ["read", "write", "manage_tasks"]}'),
    ('Member', '{"project": ["read", "write"]}'),
    ('Viewer', '{"project": ["read"]}');

INSERT INTO project_status (status_name, color_code) VALUES
    ('Active', '#22C55E'),
    ('On Hold', '#F59E0B'),
    ('Completed', '#3B82F6'),
    ('Archived', '#6B7280');

INSERT INTO project_priorities (name, weight, color_code) VALUES
    ('Urgent', 4, '#EF4444'),
    ('High', 3, '#F97316'),
    ('Medium', 2, '#EAB308'),
    ('Low', 1, '#94A3B8');

INSERT INTO task_status (status_name, position, color_code) VALUES
    ('Todo', 0, '#94A3B8'),
    ('In Progress', 1, '#3B82F6'),
    ('Review', 2, '#8B5CF6'),
    ('Done', 3, '#22C55E');
