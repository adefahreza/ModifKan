-- $1 buyer_id, $2 store_id, $3 total, $4 recipient, $5 phone, $6 address, $7 city, $8 postal_code
INSERT INTO orders (buyer_id, store_id, total, shipping_recipient, shipping_phone, shipping_address, shipping_city, shipping_postal_code)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id;
