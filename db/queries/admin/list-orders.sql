-- $1 status (nullable = semua); semua toko
SELECT o.id, o.status, o.total, o.created_at,
       u.name AS buyer_name, s.name AS store_name,
       string_agg(oi.product_name || ' ×' || oi.qty, ', ' ORDER BY oi.id) AS item_summary,
       COUNT(oi.id)::int AS item_count
FROM orders o
LEFT JOIN users u ON u.id = o.buyer_id
LEFT JOIN stores s ON s.id = o.store_id
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE ($1::text IS NULL OR o.status = $1)
GROUP BY o.id, u.name, s.name
ORDER BY o.created_at DESC, o.id DESC;
