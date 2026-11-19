-- khusus test: $1 buyer_id, $2 id order terakhir sebelum test (order_items ikut terhapus)
DELETE FROM orders WHERE buyer_id = $1 AND id > $2;
