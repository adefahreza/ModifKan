-- $1 buyer_id, $2 product_id
DELETE FROM cart_items WHERE buyer_id = $1 AND product_id = $2;
