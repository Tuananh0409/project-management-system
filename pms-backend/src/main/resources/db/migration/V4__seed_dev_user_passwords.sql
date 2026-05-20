-- Dev accounts: password = Admin@123 (BCrypt strength 10)
UPDATE users
SET password_hash = '$2a$10$wUlQft7lBlcwLz6POtJ0EuxGs0.Eqbo.FF.XVOvJXbs7I7ocBTzfa'
WHERE email IN ('admin@ctel.local', 'member@ctel.local')
  AND password_hash IS NULL;
