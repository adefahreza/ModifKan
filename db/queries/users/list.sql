-- $1 q (nullable; cari di nama/email, ILIKE)
SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
       s.name AS store_name, s.status AS store_status
FROM users u
LEFT JOIN stores s ON s.user_id = u.id
WHERE u.role IN ('buyer', 'seller')
  AND ($1::text IS NULL OR u.name ILIKE '%' || $1 || '%' OR u.email ILIKE '%' || $1 || '%')
ORDER BY u.created_at DESC, u.id DESC;
