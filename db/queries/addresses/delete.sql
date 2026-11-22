-- $1 id, $2 buyer_id
DELETE FROM addresses WHERE id = $1 AND buyer_id = $2 RETURNING id;
