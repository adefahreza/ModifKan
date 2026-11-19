-- $1 buyer_id, $2 product_id, $3 qty (tidak ada baris hasil = total qty akan melebihi stok)
INSERT INTO cart_items (buyer_id, product_id, qty)
SELECT $1, p.id, $3 FROM products p WHERE p.id = $2 AND $3 <= p.stock
ON CONFLICT (buyer_id, product_id) DO UPDATE SET qty = cart_items.qty + EXCLUDED.qty
WHERE cart_items.qty + EXCLUDED.qty <= (SELECT stock FROM products WHERE id = EXCLUDED.product_id)
RETURNING product_id;
