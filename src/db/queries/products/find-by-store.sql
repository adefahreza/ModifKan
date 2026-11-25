-- $1 id, $2 store_id
SELECT id, category_id, name, description, price, stock, image
FROM products WHERE id = $1 AND store_id = $2;
