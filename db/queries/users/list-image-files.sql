-- $1 user_id; semua gambar milik user itu: foto profil, gambar toko, dan gambar produk
SELECT u.avatar AS image FROM users u WHERE u.id = $1 AND u.avatar IS NOT NULL
UNION ALL
SELECT s.image FROM stores s WHERE s.user_id = $1 AND s.image IS NOT NULL
UNION ALL
SELECT p.image FROM products p JOIN stores s ON s.id = p.store_id WHERE s.user_id = $1;
