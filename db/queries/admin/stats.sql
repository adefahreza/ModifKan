-- tanpa parameter; satu baris ringkasan
SELECT
  (SELECT count(*) FROM users WHERE role = 'buyer')::int AS buyers,
  (SELECT count(*) FROM stores WHERE status = 'pending')::int AS sellers_pending,
  (SELECT count(*) FROM stores WHERE status = 'approved')::int AS sellers_approved,
  (SELECT count(*) FROM stores WHERE status = 'rejected')::int AS sellers_rejected,
  (SELECT count(*) FROM products)::int AS products,
  (SELECT count(*) FROM orders)::int AS orders;
