-- $1 id, $2 admin_id
DELETE FROM users WHERE id = $1 AND id <> $2 AND role <> 'admin'
RETURNING id;
