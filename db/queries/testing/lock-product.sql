-- khusus test: $1 product_id; kunci baris produk sampai transaksi selesai
SELECT id FROM products WHERE id = $1 FOR UPDATE;
