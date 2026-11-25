-- $1 token
DELETE FROM sessions WHERE token = $1;
