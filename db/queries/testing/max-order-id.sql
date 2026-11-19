-- khusus test: id order terbesar
SELECT COALESCE(MAX(id), 0)::int AS max_id FROM orders;
