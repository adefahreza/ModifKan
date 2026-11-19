-- $1 id
SELECT password_hash FROM users WHERE id = $1;
