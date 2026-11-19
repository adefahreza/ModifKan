-- khusus test: $1 product_id, $2 stock
UPDATE products SET stock = $2 WHERE id = $1;
