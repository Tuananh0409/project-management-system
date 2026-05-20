-- Dev users for local testing (no login yet — use X-User-Id header)

INSERT INTO users (email, username, status) VALUES
    ('admin@ctel.local', 'admin', 'ACTIVE'),
    ('member@ctel.local', 'member', 'ACTIVE');
