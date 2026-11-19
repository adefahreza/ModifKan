-- khusus test: $1 product_id; gagal (55P03) kalau baris sedang dikunci transaksi lain
SELECT id FROM products WHERE id = $1 FOR UPDATE NOWAIT;
