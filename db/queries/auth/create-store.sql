-- $1 user_id, $2 name (status awal: pending)
INSERT INTO stores (user_id, name) VALUES ($1, $2)
RETURNING id;
