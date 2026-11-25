-- $1 buyer_id
SELECT product_id FROM wishlist_items WHERE buyer_id = $1;
