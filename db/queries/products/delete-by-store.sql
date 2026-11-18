-- $1 id, $2 store_id
DELETE FROM products WHERE id = $1 AND store_id = $2 RETURNING image;
