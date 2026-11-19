-- $1 store_id
SELECT status, COUNT(*)::int AS count
FROM orders
WHERE store_id = $1
GROUP BY status;
