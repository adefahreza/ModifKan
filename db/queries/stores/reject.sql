-- $1 store_id, $2 alasan penolakan. Hanya dari pending.
UPDATE stores SET status = 'rejected', status_reason = $2, updated_at = now()
WHERE id = $1 AND status = 'pending'
RETURNING id;
