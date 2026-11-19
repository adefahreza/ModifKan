-- $1 user_id, $2 token sesi saat ini (tetap login)
DELETE FROM sessions WHERE user_id = $1 AND token <> $2;
