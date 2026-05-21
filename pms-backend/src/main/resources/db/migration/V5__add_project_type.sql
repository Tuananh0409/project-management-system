ALTER TABLE projects
    ADD COLUMN project_type VARCHAR(20) NOT NULL DEFAULT 'KANBAN';

COMMENT ON COLUMN projects.project_type IS 'KANBAN | SCRUM | STANDARD — ảnh hưởng board mặc định sau này';
