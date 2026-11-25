-- $1 buyer_id
SELECT id, recipient, phone, address, city, postal_code
FROM addresses
WHERE buyer_id = $1
ORDER BY id;
