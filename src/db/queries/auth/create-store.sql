-- $1 user_id, $2 name, $3 ktp_image (status awal: pending)
INSERT INTO stores (user_id, name, ktp_image) VALUES ($1, $2, $3)
RETURNING id;
