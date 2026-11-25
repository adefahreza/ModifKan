-- $1 order_id; item dengan product_id NULL terlewati oleh join.
-- Produk dikunci dulu berurutan id (sama seperti lock-cart-products) supaya tidak deadlock.
WITH locked AS MATERIALIZED (
  SELECT p.id
  FROM products p
  JOIN order_items oi ON oi.product_id = p.id
  WHERE oi.order_id = $1
  ORDER BY p.id
  FOR UPDATE OF p
)
UPDATE products p
SET stock = p.stock + oi.qty, updated_at = now()
FROM order_items oi
WHERE oi.order_id = $1 AND p.id = oi.product_id AND p.id IN (SELECT id FROM locked);
