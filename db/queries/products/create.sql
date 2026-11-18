-- $1 store_id, $2 category_id, $3 name, $4 description, $5 price, $6 stock, $7 image
INSERT INTO products (store_id, category_id, name, description, price, stock, image)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id;
