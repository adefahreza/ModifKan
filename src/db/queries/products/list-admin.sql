-- $1 q (nullable; cari nama produk, ILIKE)
SELECT p.id, p.name, p.price, p.stock, p.image, s.name AS store_name, c.name AS category_name
FROM products p
JOIN stores s ON s.id = p.store_id
JOIN categories c ON c.id = p.category_id
WHERE $1::text IS NULL OR p.name ILIKE '%' || $1 || '%'
ORDER BY p.created_at DESC, p.id DESC;
