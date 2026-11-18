-- $1 token, $2 user_id, $3 expires_at
INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3);
