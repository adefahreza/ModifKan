-- $1 product_id
SELECT r.rating, r.comment, r.created_at, u.name AS buyer_name
FROM reviews r
JOIN users u ON u.id = r.buyer_id
WHERE r.product_id = $1
ORDER BY r.created_at DESC, r.id DESC;
