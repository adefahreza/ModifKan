-- $1 id, $2 admin_id
-- Tidak menghapus user yang masih punya pesanan berjalan, baik sebagai pembeli maupun lewat tokonya.
DELETE FROM users u
WHERE u.id = $1 AND u.id <> $2 AND u.role <> 'admin'
  AND NOT EXISTS (
    SELECT 1 FROM orders o LEFT JOIN stores s ON s.id = o.store_id
    WHERE o.status IN ('menunggu_pembayaran','diproses','dikirim')
      AND (o.buyer_id = u.id OR s.user_id = u.id)
  )
RETURNING id;
