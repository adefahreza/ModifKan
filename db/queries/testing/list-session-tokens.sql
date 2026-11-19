-- khusus test: $1 user_id; token sesi milik user itu
SELECT token FROM sessions WHERE user_id = $1 ORDER BY token;
