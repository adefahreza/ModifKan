-- $1 id (bukan admin)
SELECT id, name, email, phone, role FROM users WHERE id = $1 AND role <> 'admin';
