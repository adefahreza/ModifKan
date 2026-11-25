-- tanpa parameter; nomor HP admin sebagai kontak Customer Service untuk seller yang ditangguhkan
SELECT phone FROM users WHERE role = 'admin' ORDER BY id LIMIT 1;
