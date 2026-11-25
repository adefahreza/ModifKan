-- $1 id, $2 name, $3 email, $4 phone. Profil admin sendiri (halaman /admin/profile).
UPDATE users SET name = $2, email = $3, phone = $4, updated_at = now()
WHERE id = $1 AND role = 'admin'
RETURNING id;
