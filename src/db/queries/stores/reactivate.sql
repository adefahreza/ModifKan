-- $1 store_id. Hanya dari suspended; alasan dikosongkan.
UPDATE stores SET status = 'approved', status_reason = NULL, updated_at = now()
WHERE id = $1 AND status = 'suspended'
RETURNING id;
