-- $1 user_id. Hanya seller dengan toko berstatus rejected yang bisa dihapus.
DELETE FROM users u USING stores s
WHERE u.id = $1 AND s.user_id = u.id AND u.role = 'seller' AND s.status = 'rejected'
RETURNING u.id;
