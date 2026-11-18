-- $1 id
DELETE FROM products WHERE id = $1 RETURNING image;
