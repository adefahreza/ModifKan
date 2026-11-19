-- $1 order_id; item dengan product_id NULL terlewati oleh join
UPDATE products p
SET stock = p.stock + oi.qty, updated_at = now()
FROM order_items oi
WHERE oi.order_id = $1 AND p.id = oi.product_id;
