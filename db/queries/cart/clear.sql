-- $1 buyer_id
DELETE FROM cart_items WHERE buyer_id = $1;
