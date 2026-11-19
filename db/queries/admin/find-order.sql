-- $1 order_id
SELECT o.id, o.status, o.total, o.created_at, o.updated_at, o.buyer_id, o.store_id,
       u.name AS buyer_name, u.phone AS buyer_phone, s.name AS store_name,
       o.shipping_recipient, o.shipping_phone, o.shipping_address, o.shipping_city, o.shipping_postal_code
FROM orders o
LEFT JOIN users u ON u.id = o.buyer_id
LEFT JOIN stores s ON s.id = o.store_id
WHERE o.id = $1;
