-- $1 status (pending|approved|rejected|suspended)
SELECT s.id, s.name, s.status, s.ktp_image, s.status_reason, s.created_at, s.updated_at,
       u.name AS owner_name, u.email, u.phone
FROM stores s
JOIN users u ON u.id = s.user_id
WHERE s.status = $1
ORDER BY s.created_at DESC, s.id DESC;
