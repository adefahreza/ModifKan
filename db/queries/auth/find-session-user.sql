-- $1 token. Session kedaluwarsa diabaikan.
SELECT u.id, u.name, u.email, u.phone, u.role, u.avatar, u.created_at,
       s.id AS store_id, s.status AS store_status, s.name AS store_name, s.created_at AS store_created_at
FROM sessions se
JOIN users u ON u.id = se.user_id
LEFT JOIN stores s ON s.user_id = u.id
WHERE se.token = $1 AND se.expires_at > now();
