-- $1 id, $2 name
UPDATE categories SET name = $2 WHERE id = $1 RETURNING id;
