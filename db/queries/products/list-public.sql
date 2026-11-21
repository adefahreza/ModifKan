-- $1 q (nullable; nama atau deskripsi, ILIKE; % _ \ dicari sebagai teks biasa), $2 category_id (nullable), $3 min_price (nullable), $4 max_price (nullable),
-- $5 sort ('terbaru' | 'harga_terendah' | 'harga_tertinggi'), $6 min_rating (nullable; rata-rata ulasan >= nilai ini)
SELECT p.id, p.name, p.price, p.stock, p.image, c.name AS category_name, s.name AS store_name,
       (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.product_id = p.id) AS avg_rating,
       (SELECT COUNT(*)::int FROM reviews r WHERE r.product_id = p.id) AS review_count
FROM products p
JOIN stores s ON s.id = p.store_id AND s.status = 'approved'
JOIN categories c ON c.id = p.category_id
WHERE ($1::text IS NULL OR p.name ILIKE '%' || replace(replace(replace($1, '\', '\\'), '%', '\%'), '_', '\_') || '%' OR p.description ILIKE '%' || replace(replace(replace($1, '\', '\\'), '%', '\%'), '_', '\_') || '%')
  AND ($2::int IS NULL OR p.category_id = $2)
  AND ($3::bigint IS NULL OR p.price >= $3)
  AND ($4::bigint IS NULL OR p.price <= $4)
  AND ($6::int IS NULL OR (SELECT AVG(r.rating) FROM reviews r WHERE r.product_id = p.id) >= $6)
ORDER BY CASE WHEN $5::text = 'harga_terendah' THEN p.price END ASC,
         CASE WHEN $5::text = 'harga_tertinggi' THEN p.price END DESC,
         p.created_at DESC, p.id DESC;
