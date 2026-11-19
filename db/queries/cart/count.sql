-- $1 buyer_id (semua item di cart, sama dengan yang tampil di /cart)
SELECT COALESCE(SUM(qty), 0)::int AS count FROM cart_items WHERE buyer_id = $1;
