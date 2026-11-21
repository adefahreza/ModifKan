-- $1 buyer_id (kolom kartu produk sama dengan products/list-public; hanya toko approved)
SELECT p.id, p.name, p.price, p.stock, p.image, c.name AS category_name, s.name AS store_name,
       (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.product_id = p.id) AS avg_rating,
       (SELECT COUNT(*)::int FROM reviews r WHERE r.product_id = p.id) AS review_count
FROM wishlist_items w
JOIN products p ON p.id = w.product_id
JOIN stores s ON s.id = p.store_id AND s.status = 'approved'
JOIN categories c ON c.id = p.category_id
WHERE w.buyer_id = $1
ORDER BY w.created_at DESC, p.id DESC;
