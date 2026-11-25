-- $1 user_id. Ringkasan aktivitas untuk halaman Edit Pengguna (Admin): sebagai pembeli dan lewat tokonya.
-- Pesanan berjalan = menunggu_pembayaran, diproses, dikirim (sama dengan syarat blokir hapus user).
SELECT
  (SELECT COUNT(*)::int FROM orders o WHERE o.buyer_id = x.uid) AS buyer_orders,
  (SELECT COUNT(*)::int FROM orders o WHERE o.buyer_id = x.uid
     AND o.status IN ('menunggu_pembayaran','diproses','dikirim')) AS buyer_active,
  (SELECT COALESCE(SUM(o.total), 0)::bigint FROM orders o WHERE o.buyer_id = x.uid AND o.status = 'selesai') AS buyer_spent,
  s.name AS store_name, s.status AS store_status,
  (SELECT COUNT(*)::int FROM products p WHERE p.store_id = s.id) AS store_products,
  (SELECT COUNT(*)::int FROM orders o WHERE o.store_id = s.id) AS store_orders,
  (SELECT COUNT(*)::int FROM orders o WHERE o.store_id = s.id
     AND o.status IN ('menunggu_pembayaran','diproses','dikirim')) AS store_active
FROM (SELECT $1::int AS uid) x
LEFT JOIN stores s ON s.user_id = x.uid;
