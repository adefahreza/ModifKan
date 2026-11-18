-- $1 id
SELECT id, name, description, image, status, created_at FROM stores WHERE id = $1;
