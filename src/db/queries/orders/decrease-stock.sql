-- $1 product_id, $2 qty (tanpa baris hasil = stok tidak cukup)
UPDATE products SET stock = stock - $2, updated_at = now()
WHERE id = $1 AND stock >= $2
RETURNING id;
