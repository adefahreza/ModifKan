-- $1 user_id, $2 nama file baru (NULL untuk menghapus). Hanya buyer.
-- Mengembalikan nama file lama supaya file-nya bisa dihapus dari disk.
UPDATE users u SET avatar = $2, updated_at = now()
FROM (SELECT id, avatar FROM users WHERE id = $1 AND role = 'buyer' FOR UPDATE) old
WHERE u.id = old.id
RETURNING old.avatar AS old_avatar;
