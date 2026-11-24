-- $1 id (bukan admin)
SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1 AND role <> 'admin';
