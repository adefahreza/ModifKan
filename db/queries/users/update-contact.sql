-- $1 id, $2 email, $3 phone. Kontak seller sendiri (halaman edit toko).
UPDATE users SET email = $2, phone = $3, updated_at = now()
WHERE id = $1 AND role = 'seller'
RETURNING id;
