-- $1 buyer_id (termasuk produk dari toko non-approved; ditandai lewat store_status agar bisa dihapus buyer)
SELECT ci.product_id, ci.qty, p.name, p.price, p.stock, p.image, s.id AS store_id, s.name AS store_name, s.status AS store_status
FROM cart_items ci
JOIN products p ON p.id = ci.product_id
JOIN stores s ON s.id = p.store_id
WHERE ci.buyer_id = $1
ORDER BY s.name, ci.created_at;
