-- $1 id
DELETE FROM categories WHERE id = $1 RETURNING id;
