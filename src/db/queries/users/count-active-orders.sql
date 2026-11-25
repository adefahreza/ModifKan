-- $1 user_id
-- Jumlah pesanan berjalan (belum selesai/dibatalkan) milik user sebagai pembeli dan pada toko miliknya.
SELECT
  (SELECT COUNT(*)::int FROM orders o
    WHERE o.buyer_id = $1 AND o.status IN ('menunggu_pembayaran','diproses','dikirim')) AS as_buyer,
  (SELECT COUNT(*)::int FROM orders o JOIN stores s ON s.id = o.store_id
    WHERE s.user_id = $1 AND o.status IN ('menunggu_pembayaran','diproses','dikirim')) AS as_seller;
