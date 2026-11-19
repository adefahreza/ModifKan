-- $1 order_id
SELECT oi.id, oi.product_id, oi.product_name, oi.price, oi.qty,
       p.image,
       r.id IS NOT NULL AS reviewed
FROM order_items oi
LEFT JOIN products p ON p.id = oi.product_id
LEFT JOIN reviews r ON r.order_item_id = oi.id
WHERE oi.order_id = $1
ORDER BY oi.id;
