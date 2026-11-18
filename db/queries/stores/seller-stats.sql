-- $1 store_id
SELECT COUNT(*)::int AS product_count,
       COUNT(*) FILTER (WHERE stock = 0)::int AS out_of_stock_count
FROM products WHERE store_id = $1;
