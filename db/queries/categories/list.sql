-- tanpa parameter
SELECT c.id, c.name, COUNT(p.id)::int AS product_count
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.id, c.name
ORDER BY c.name;
