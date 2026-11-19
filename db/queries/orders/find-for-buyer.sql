-- $1 order_id, $2 buyer_id
SELECT o.id, o.status, o.total, o.created_at, o.updated_at, o.store_id,
       s.name AS store_name,
       o.shipping_recipient, o.shipping_phone, o.shipping_address, o.shipping_city, o.shipping_postal_code
FROM orders o
LEFT JOIN stores s ON s.id = o.store_id
WHERE o.id = $1 AND o.buyer_id = $2;
