-- $1 product_id, $2 buyer_id (stok produk publik + qty yang sudah ada di cart)
SELECT p.stock,
       COALESCE((SELECT ci.qty FROM cart_items ci WHERE ci.buyer_id = $2 AND ci.product_id = p.id), 0) AS in_cart
FROM products p
JOIN stores s ON s.id = p.store_id AND s.status = 'approved'
WHERE p.id = $1;
