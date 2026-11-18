-- $1 user_id; semua gambar toko dan produk milik user itu
SELECT s.image FROM stores s WHERE s.user_id = $1 AND s.image IS NOT NULL
UNION ALL
SELECT p.image FROM products p JOIN stores s ON s.id = p.store_id WHERE s.user_id = $1;
