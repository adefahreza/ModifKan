-- $1 order_id, $2 buyer_id, $3 status tujuan, $4 status asal
UPDATE orders
SET status = $3, updated_at = now()
WHERE id = $1 AND buyer_id = $2 AND status = $4
RETURNING id;
