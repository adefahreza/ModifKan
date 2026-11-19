-- $1 buyer_id (semua baris cart, tanpa filter toko)
SELECT COUNT(*)::int AS count FROM cart_items WHERE buyer_id = $1;
