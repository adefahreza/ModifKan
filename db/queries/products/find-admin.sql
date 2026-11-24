-- $1 id. Detail produk untuk dashboard Admin: produk dari toko mana pun, termasuk yang belum/tidak approved.
SELECT p.id, p.name, p.description, p.price, p.stock, p.image, p.created_at, p.updated_at,
       c.name AS category_name, s.name AS store_name, s.status AS store_status,
       (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.product_id = p.id) AS avg_rating,
       (SELECT COUNT(*)::int FROM reviews r WHERE r.product_id = p.id) AS review_count
FROM products p
JOIN stores s ON s.id = p.store_id
JOIN categories c ON c.id = p.category_id
WHERE p.id = $1;
