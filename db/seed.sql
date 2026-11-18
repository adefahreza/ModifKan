-- Akun demo:
--   admin   admin@modifkan.test        / admin12345
--   buyer   rizky@modifkan.test        / modifkan123
--   seller  garasijaya@modifkan.test   / modifkan123  (approved)
--   seller  speedshop@modifkan.test    / modifkan123  (approved)
--   seller  kakikuat@modifkan.test     / modifkan123  (approved)
--   seller  turbolokal@modifkan.test   / modifkan123  (pending)
--   seller  bengkelasal@modifkan.test  / modifkan123  (rejected)

INSERT INTO categories (name) VALUES
  ('Mesin'), ('Kaki-kaki & Rem'), ('Velg & Ban'), ('Knalpot'), ('Body Kit & Eksterior'),
  ('Interior'), ('Lampu & Kelistrikan'), ('Oli & Perawatan'), ('Aksesoris');

INSERT INTO users (name, email, phone, password_hash, role) VALUES
  ('Admin ModifKan', 'admin@modifkan.test',       '081200000001', '$2b$10$o/af7ll0.7gPgHzC3UI8ueWngCXxKOBLTrtVQ/2Z5IqziLmNmA8rq', 'admin'),
  ('Rizky Aditya',   'rizky@modifkan.test',       '081200000002', '$2b$10$KgfK42/n4yZD9yTYDDjFVe7j0JzJNxLyRWUTpOCAeE/g/fT/UzTt2', 'buyer'),
  ('Joko Garasi',    'garasijaya@modifkan.test',  '081200000003', '$2b$10$KgfK42/n4yZD9yTYDDjFVe7j0JzJNxLyRWUTpOCAeE/g/fT/UzTt2', 'seller'),
  ('Dewi Speed',     'speedshop@modifkan.test',   '081200000004', '$2b$10$KgfK42/n4yZD9yTYDDjFVe7j0JzJNxLyRWUTpOCAeE/g/fT/UzTt2', 'seller'),
  ('Kaka Kuat',      'kakikuat@modifkan.test',    '081200000005', '$2b$10$KgfK42/n4yZD9yTYDDjFVe7j0JzJNxLyRWUTpOCAeE/g/fT/UzTt2', 'seller'),
  ('Tono Turbo',     'turbolokal@modifkan.test',  '081200000006', '$2b$10$KgfK42/n4yZD9yTYDDjFVe7j0JzJNxLyRWUTpOCAeE/g/fT/UzTt2', 'seller'),
  ('Bayu Bengkel',   'bengkelasal@modifkan.test', '081200000007', '$2b$10$KgfK42/n4yZD9yTYDDjFVe7j0JzJNxLyRWUTpOCAeE/g/fT/UzTt2', 'seller');

INSERT INTO stores (user_id, name, status)
SELECT id, s.store_name, s.store_status
FROM users u
JOIN (VALUES
  ('garasijaya@modifkan.test',  'Garasi Jaya',  'approved'),
  ('speedshop@modifkan.test',   'Speedshop ID', 'approved'),
  ('kakikuat@modifkan.test',    'Kaki Kuat',    'approved'),
  ('turbolokal@modifkan.test',  'Turbo Lokal',  'pending'),
  ('bengkelasal@modifkan.test', 'Bengkel Asal', 'rejected')
) AS s(email, store_name, store_status) ON s.email = u.email;
