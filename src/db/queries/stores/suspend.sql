-- $1 store_id, $2 alasan penangguhan. Hanya dari approved.
UPDATE stores SET status = 'suspended', status_reason = $2, updated_at = now()
WHERE id = $1 AND status = 'approved'
RETURNING id;
