-- $1 store_id, $2 status baru (hanya dari pending)
UPDATE stores SET status = $2, updated_at = now()
WHERE id = $1 AND status = 'pending'
RETURNING id;
