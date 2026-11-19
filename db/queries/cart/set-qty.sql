-- $1 buyer_id, $2 product_id, $3 qty
UPDATE cart_items SET qty = $3
WHERE buyer_id = $1 AND product_id = $2
RETURNING product_id;
