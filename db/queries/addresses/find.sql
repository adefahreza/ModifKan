-- $1 id, $2 buyer_id (hanya milik buyer itu)
SELECT id, recipient, phone, address, city, postal_code
FROM addresses
WHERE id = $1 AND buyer_id = $2;
