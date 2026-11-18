-- $1 email (huruf kecil)
SELECT u.id, u.name, u.email, u.password_hash, u.role,
       s.id AS store_id, s.status AS store_status
FROM users u
LEFT JOIN stores s ON s.user_id = u.id
WHERE u.email = $1;
