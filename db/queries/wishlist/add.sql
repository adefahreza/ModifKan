-- $1 buyer_id, $2 product_id (hanya produk dari toko approved; sudah ada = tidak error, 0 baris)
INSERT INTO wishlist_items (buyer_id, product_id)
SELECT $1, p.id
FROM products p
JOIN stores s ON s.id = p.store_id AND s.status = 'approved'
WHERE p.id = $2
ON CONFLICT DO NOTHING
RETURNING product_id;
