-- $1 status (pending|approved|rejected)
SELECT s.id, s.name, s.status, s.created_at, u.name AS owner_name, u.email, u.phone
FROM stores s
JOIN users u ON u.id = s.user_id
WHERE s.status = $1
ORDER BY s.created_at DESC, s.id DESC;
