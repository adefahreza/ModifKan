-- $1 buyer_id, $2 status (nullable = semua)
SELECT o.id, o.status, o.total, o.created_at,
       s.name AS store_name,
       string_agg(oi.product_name || ' ×' || oi.qty, ', ' ORDER BY oi.id) AS item_summary,
       COUNT(oi.id)::int AS item_count
FROM orders o
LEFT JOIN stores s ON s.id = o.store_id
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE o.buyer_id = $1 AND ($2::text IS NULL OR o.status = $2)
GROUP BY o.id, s.name
ORDER BY o.created_at DESC, o.id DESC;
