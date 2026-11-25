-- $1 order_id, $2 product_id, $3 product_name, $4 price, $5 qty
INSERT INTO order_items (order_id, product_id, product_name, price, qty)
VALUES ($1, $2, $3, $4, $5);
