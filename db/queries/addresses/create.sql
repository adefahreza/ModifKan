-- $1 buyer_id, $2 recipient, $3 phone, $4 address, $5 city, $6 postal_code
INSERT INTO addresses (buyer_id, recipient, phone, address, city, postal_code)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id;
