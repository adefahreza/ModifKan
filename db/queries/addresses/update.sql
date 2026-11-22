-- $1 id, $2 buyer_id, $3 recipient, $4 phone, $5 address, $6 city, $7 postal_code
UPDATE addresses
SET recipient = $3, phone = $4, address = $5, city = $6, postal_code = $7
WHERE id = $1 AND buyer_id = $2
RETURNING id;
