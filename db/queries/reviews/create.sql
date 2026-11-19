-- $1 order_item_id, $2 buyer_id, $3 rating, $4 comment
-- Hanya item milik buyer ini, pada order selesai, dengan produk yang masih ada. Satu ulasan per item.
INSERT INTO reviews (order_item_id, product_id, buyer_id, rating, comment)
SELECT oi.id, oi.product_id, $2, $3, $4
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE oi.id = $1 AND o.buyer_id = $2 AND o.status = 'selesai' AND oi.product_id IS NOT NULL
ON CONFLICT (order_item_id) DO NOTHING
RETURNING id, product_id;
