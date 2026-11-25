-- $1 name, $2 email (huruf kecil), $3 phone, $4 password_hash, $5 role
INSERT INTO users (name, email, phone, password_hash, role)
VALUES ($1, $2, $3, $4, $5)
RETURNING id;
