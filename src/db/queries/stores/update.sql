-- $1 id, $2 name, $3 description (nullable), $4 image (nullable: null = tetap)
UPDATE stores SET name = $2, description = $3, image = COALESCE($4, image), updated_at = now()
WHERE id = $1
RETURNING id;
