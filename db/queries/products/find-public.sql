-- $1 id (hanya produk dari toko approved)
SELECT p.id, p.name, p.description, p.price, p.stock, p.image, p.category_id,
       c.name AS category_name, s.id AS store_id, s.name AS store_name, s.image AS store_image,
       (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.product_id = p.id) AS avg_rating,
       (SELECT COUNT(*)::int FROM reviews r WHERE r.product_id = p.id) AS review_count
FROM products p
JOIN stores s ON s.id = p.store_id AND s.status = 'approved'
JOIN categories c ON c.id = p.category_id
WHERE p.id = $1;
