-- $1 buyer_id (produk dari toko approved; baris produk dikunci sampai transaksi selesai)
SELECT p.id AS product_id, p.name, p.price, p.stock, ci.qty, p.store_id
FROM cart_items ci
JOIN products p ON p.id = ci.product_id
JOIN stores s ON s.id = p.store_id AND s.status = 'approved'
WHERE ci.buyer_id = $1
ORDER BY p.id
FOR UPDATE OF ci, p;
