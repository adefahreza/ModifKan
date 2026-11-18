-- $1 store_id
SELECT p.id, p.name, p.price, p.stock, p.image, c.name AS category_name
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE p.store_id = $1
ORDER BY p.created_at DESC, p.id DESC;
