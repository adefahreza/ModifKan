-- $1 id, $2 store_id, $3 category_id, $4 name, $5 description, $6 price, $7 stock, $8 image (nullable: null = tetap)
UPDATE products
SET category_id = $3, name = $4, description = $5, price = $6, stock = $7,
    image = COALESCE($8, image), updated_at = now()
WHERE id = $1 AND store_id = $2
RETURNING id;
