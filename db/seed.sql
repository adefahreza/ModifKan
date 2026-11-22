-- Akun demo:
--   admin   admin@modifkan.test        / admin12345
--   buyer   rizky@modifkan.test        / modifkan123  (Rizky Aditya)
--   buyer   dewi@modifkan.test         / modifkan123  (Dewi Lestari)
--   buyer   bagas@modifkan.test        / modifkan123  (Bagas Pratama)
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
  ('Dewi Lestari',   'dewi@modifkan.test',        '081200000008', '$2b$10$KgfK42/n4yZD9yTYDDjFVe7j0JzJNxLyRWUTpOCAeE/g/fT/UzTt2', 'buyer'),
  ('Bagas Pratama',  'bagas@modifkan.test',       '081200000009', '$2b$10$KgfK42/n4yZD9yTYDDjFVe7j0JzJNxLyRWUTpOCAeE/g/fT/UzTt2', 'buyer'),
  ('Joko Garasi',    'garasijaya@modifkan.test',  '081200000003', '$2b$10$KgfK42/n4yZD9yTYDDjFVe7j0JzJNxLyRWUTpOCAeE/g/fT/UzTt2', 'seller'),
  ('Dewi Speed',     'speedshop@modifkan.test',   '081200000004', '$2b$10$KgfK42/n4yZD9yTYDDjFVe7j0JzJNxLyRWUTpOCAeE/g/fT/UzTt2', 'seller'),
  ('Kaki Kuat',      'kakikuat@modifkan.test',    '081200000005', '$2b$10$KgfK42/n4yZD9yTYDDjFVe7j0JzJNxLyRWUTpOCAeE/g/fT/UzTt2', 'seller'),
  ('Tono Turbo',     'turbolokal@modifkan.test',  '081200000006', '$2b$10$KgfK42/n4yZD9yTYDDjFVe7j0JzJNxLyRWUTpOCAeE/g/fT/UzTt2', 'seller'),
  ('Bayu Bengkel',   'bengkelasal@modifkan.test', '081200000007', '$2b$10$KgfK42/n4yZD9yTYDDjFVe7j0JzJNxLyRWUTpOCAeE/g/fT/UzTt2', 'seller');

INSERT INTO stores (user_id, name, description, image, status)
SELECT u.id, s.store_name, s.descr, s.img, s.store_status
FROM users u
JOIN (VALUES
  ('garasijaya@modifkan.test',  'Garasi Jaya',  'Spesialis performa mesin, knalpot, dan oli untuk mobil harian maupun proyek modifikasi. Semua barang dicek sebelum dikirim.', 'seed/10-3.webp', 'approved'),
  ('speedshop@modifkan.test',   'Speedshop ID', 'Part tampilan dan interior bergaya racing: jok, setir, spoiler, dan lampu custom untuk mobil impianmu.',                     'seed/10-4.webp', 'approved'),
  ('kakikuat@modifkan.test',    'Kaki Kuat',    'Kaki-kaki, rem, dan velg untuk handling yang lebih tajam. Melayani konsultasi ukuran dan PCD sebelum membeli.',               'seed/10-6.webp', 'approved'),
  ('turbolokal@modifkan.test',  'Turbo Lokal',  NULL, NULL, 'pending'),
  ('bengkelasal@modifkan.test', 'Bengkel Asal', NULL, NULL, 'rejected')
) AS s(email, store_name, descr, img, store_status) ON s.email = u.email;

-- Produk: 8 per toko (kategori dan toko dicari lewat nama)
INSERT INTO products (store_id, category_id, name, description, price, stock, image, created_at, updated_at)
SELECT s.id, c.id, v.name, v.descr, v.price, v.stock, v.img, now() - v.age, now() - v.age
FROM (VALUES
  -- Garasi Jaya
  ('Garasi Jaya', 'Mesin', 'Intake Manifold Performance Hitam', E'Intake manifold bergaya performa dengan runner panjang untuk aliran udara lebih lancar. Dilengkapi selang dan klem stainless.\nCocok untuk: mobil sedan 4-silinder dan 6-silinder dengan proyek peningkatan tenaga.', 3850000, 8, 'seed/1-1.webp', interval '20 days'),
  ('Garasi Jaya', 'Mesin', 'Set Dress-Up Mesin V8 Chrome', E'Paket tutup klep dan air cleaner oval berlapis chrome untuk tampilan ruang mesin yang mengilap. Pemasangan baut-on tanpa modifikasi.\nCocok untuk: mobil klasik bermesin V8 dan pecinta tampilan retro.', 2450000, 6, 'seed/1-2.webp', interval '19 days'),
  ('Garasi Jaya', 'Mesin', 'Turbocharger Kit Ball Bearing Universal', E'Turbo ball bearing dengan respons cepat dan housing berpoles. Termasuk wastegate dan pipa dump.\nCocok untuk: proyek turbo conversion mesin 1.5 sampai 2.0 liter.', 8900000, 3, 'seed/1-6.webp', interval '18 days'),
  ('Garasi Jaya', 'Knalpot', 'Tip Knalpot Ganda Stainless Hitam Glossy', E'Tip knalpot ganda dari stainless steel dengan finishing hitam glossy tahan panas. Mudah dipasang dengan klem.\nCocok untuk: mobil SUV dan sedan bumper berlubang ganda.', 1250000, 12, 'seed/4-1.webp', interval '17 days'),
  ('Garasi Jaya', 'Knalpot', 'Tip Knalpot Ganda Carbon Fiber', E'Tip knalpot ganda berlapis carbon fiber asli dengan ujung stainless berlubang halus. Ringan dan tampil agresif.\nCocok untuk: mobil sport dengan diffuser belakang.', 1950000, 0, 'seed/4-2.webp', interval '16 days'),
  ('Garasi Jaya', 'Oli & Perawatan', 'Oli Mesin Full Synthetic 0W-40 4 Liter', E'Oli full synthetic 0W-40 untuk perlindungan mesin pada suhu tinggi dan penggunaan agresif. Kemasan segel resmi.\nCocok untuk: mobil bensin harian maupun track day.', 685000, 40, 'seed/8-1.webp', interval '15 days'),
  ('Garasi Jaya', 'Oli & Perawatan', 'Oli Mesin Klasik Multigrade 20W-50 Kaleng', E'Oli multigrade 20W-50 dengan kemasan kaleng ala vintage. Kental dan stabil untuk mesin berumur.\nCocok untuk: mobil klasik dan koleksi.', 185000, 2, 'seed/8-5.webp', interval '14 days'),
  ('Garasi Jaya', 'Lampu & Kelistrikan', 'Headlamp LED DRL Biru Es + Foglamp Set', E'Satu set headlamp LED dengan DRL biru es dan foglamp berwarna senada. Cahaya terang dan merata.\nCocok untuk: sedan eropa generasi menengah.', 2350000, 10, 'seed/7-1.webp', interval '13 days'),
  -- Speedshop ID
  ('Speedshop ID', 'Body Kit & Eksterior', 'Spoiler Bagasi Ducktail Sedan Universal', E'Spoiler bagasi model ducktail dari ABS tebal, siap cat. Dilengkapi double tape 3M untuk pemasangan rapi.\nCocok untuk: sedan kompak dan mid-size.', 650000, 15, 'seed/5-3.webp', interval '12 days'),
  ('Speedshop ID', 'Body Kit & Eksterior', 'Wing GT Belakang Carbon Look Adjustable', E'Sayap belakang gaya GT dengan sudut yang dapat diatur dan dudukan berwarna hitam. Menambah downforce sekaligus tampilan track.\nCocok untuk: mobil sport dan proyek time attack.', 3200000, 4, 'seed/5-5.webp', interval '11 days'),
  ('Speedshop ID', 'Interior', 'Jok Racing Bucket Fiber Hitam Harness Merah', E'Jok bucket berbahan kain hitam dengan lubang harness dan rangka fiber ringan. Dilengkapi sabuk harness merah.\nCocok untuk: mobil rally, drift, dan harian bergaya racing.', 3450000, 7, 'seed/6-1.webp', interval '10 days'),
  ('Speedshop ID', 'Interior', 'Jok Sport Kain Motif Hexagon Reclining', E'Jok sport dengan sandaran dapat diatur dan motif hexagon di kain bagian tengah. Nyaman untuk perjalanan jauh.\nCocok untuk: hatchback dan sedan klasik yang ingin interior lebih sporty.', 2900000, 6, 'seed/6-2.webp', interval '9 days'),
  ('Speedshop ID', 'Interior', 'Setir Racing Carbon Look 14 Inci', E'Setir racing diameter 14 inci dengan lapisan carbon look dan spoke aluminium. Cengkeraman mantap.\nCocok untuk: mobil Jepang 90-an dan proyek interior racing. Butuh boss kit sesuai mobil.', 890000, 20, 'seed/6-5.webp', interval '8 days'),
  ('Speedshop ID', 'Lampu & Kelistrikan', 'Headlamp Angel Eyes Projector Sepasang', E'Headlamp projector dengan ring angel eyes putih dan lampu aksen merah di tengah. Dijual sepasang kiri-kanan.\nCocok untuk: sedan eropa lansiran awal 2000-an.', 2100000, 9, 'seed/7-2.webp', interval '7 days'),
  ('Speedshop ID', 'Lampu & Kelistrikan', 'Lampu Depan Halo Ring Merah Projector', E'Lampu depan projector dengan halo ring merah menyala terang untuk tampilan malam yang tegas. Sepasang.\nCocok untuk: coupe dan sedan bergaya muscle.', 1850000, 11, 'seed/7-4.webp', interval '6 days'),
  ('Speedshop ID', 'Aksesoris', 'Speaker Pintu Premium Grill Aluminium 6.5 Inci', E'Sepasang speaker pintu dengan grill aluminium berlubang halus. Suara jernih dan bass padat.\nCocok untuk: upgrade audio mobil harian.', 1600000, 14, 'seed/9-1.webp', interval '5 days'),
  -- Kaki Kuat
  ('Kaki Kuat', 'Kaki-kaki & Rem', 'Coilover Racing Pegas Merah Set 4 Roda', E'Coilover adjustable dengan pegas merah, ketinggian dan damping dapat disetel. Satu set untuk empat roda.\nCocok untuk: hatchback dan sedan yang ingin handling lebih rendah dan tajam.', 4750000, 6, 'seed/2-1.webp', interval '12 days'),
  ('Kaki Kuat', 'Kaki-kaki & Rem', 'Piringan Rem Drilled-Slotted + Wheel Spacer', E'Cakram rem berlubang dan beralur untuk pembuangan panas dan gas lebih baik, plus wheel spacer baja hitam.\nCocok untuk: mobil harian dengan penggunaan jalan tol dan pegunungan.', 2200000, 9, 'seed/2-3.webp', interval '11 days'),
  ('Kaki Kuat', 'Kaki-kaki & Rem', 'Big Brake Kit 6 Piston Cakram Dua Bagian', E'Kaliper 6 piston dengan cakram dua bagian berventilasi. Daya henti besar dan tahan panas.\nCocok untuk: mobil performa tinggi dan track day.', 18500000, 3, 'seed/2-5.webp', interval '10 days'),
  ('Kaki Kuat', 'Velg & Ban', 'Velg Mesh Gold Polished Lip Ring 17 Set 4', E'Velg desain mesh warna emas dengan lip berpoles. Ring 17 untuk tampilan klasik ala tuner.\nCocok untuk: sedan dan hatchback klasik, PCD sesuai konsultasi.', 7800000, 5, 'seed/3-3.webp', interval '9 days'),
  ('Kaki Kuat', 'Velg & Ban', 'Velg 9 Spoke Polished Lip Ring 16 Set 4', E'Velg sembilan spoke berpoles dengan lip lebar dan baut dekoratif. Ringan dan kuat.\nCocok untuk: mobil Jepang stance dan retro.', 6200000, 4, 'seed/3-5.webp', interval '8 days'),
  ('Kaki Kuat', 'Velg & Ban', 'Velg Racing Bronze 10 Spoke Ring 17 Set 4', E'Velg 10 spoke warna bronze matte, ringan dan cocok dipadukan dengan bodi merah atau putih. Satu set empat buah.\nCocok untuk: hatchback sporty dan mobil harian.', 6900000, 8, 'seed/3-6.webp', interval '7 days'),
  ('Kaki Kuat', 'Velg & Ban', 'Velg Machined Two-Tone Ring 18 Set 4', E'Velg two-tone dengan permukaan machined, hitam dan perak. Desain spoke runcing modern.\nCocok untuk: sedan dan SUV kompak yang ingin tampilan premium.', 9800000, 5, 'seed/3-8.webp', interval '6 days'),
  ('Kaki Kuat', 'Aksesoris', 'Paket Kabin Knob Persneling Bulat + Gantungan Tengkorak', E'Knob persneling bulat aluminium dan gantungan kaca bergaya tengkorak. Sentuhan personal untuk kabin.\nCocok untuk: mobil Jepang 90-an dan pecinta interior custom.', 275000, 25, 'seed/9-4.webp', interval '5 days')
) AS v(store_name, cat_name, name, descr, price, stock, img, age)
JOIN stores s ON s.name = v.store_name
JOIN categories c ON c.name = v.cat_name;

-- Fungsi bantu sementara untuk membuat order beserta item snapshot-nya (hilang otomatis di akhir sesi)
CREATE FUNCTION pg_temp.seed_order(p_email text, p_store text, p_status text, p_age interval, p_names text[], p_qtys int[])
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_order_id int;
BEGIN
  INSERT INTO orders (buyer_id, store_id, status, total, created_at, updated_at)
  SELECT u.id, s.id, p_status,
         (SELECT SUM(p.price * q.qty)::int
          FROM unnest(p_names, p_qtys) AS q(pname, qty)
          JOIN products p ON p.name = q.pname AND p.store_id = s.id),
         now() - p_age, now() - p_age
  FROM users u, stores s
  WHERE u.email = p_email AND s.name = p_store
  RETURNING id INTO v_order_id;

  INSERT INTO order_items (order_id, product_id, product_name, price, qty)
  SELECT v_order_id, p.id, p.name, p.price, q.qty
  FROM unnest(p_names, p_qtys) AS q(pname, qty)
  JOIN products p ON p.name = q.pname AND p.store_id = (SELECT id FROM stores WHERE name = p_store);
END $$;

SELECT pg_temp.seed_order('rizky@modifkan.test', 'Garasi Jaya',  'selesai',             interval '12 days',
  ARRAY['Oli Mesin Full Synthetic 0W-40 4 Liter', 'Tip Knalpot Ganda Stainless Hitam Glossy'], ARRAY[2, 1]);
SELECT pg_temp.seed_order('rizky@modifkan.test', 'Kaki Kuat',    'selesai',             interval '9 days',
  ARRAY['Coilover Racing Pegas Merah Set 4 Roda'], ARRAY[1]);
SELECT pg_temp.seed_order('dewi@modifkan.test',  'Speedshop ID', 'selesai',             interval '7 days',
  ARRAY['Setir Racing Carbon Look 14 Inci', 'Jok Racing Bucket Fiber Hitam Harness Merah'], ARRAY[1, 2]);
SELECT pg_temp.seed_order('bagas@modifkan.test', 'Kaki Kuat',    'dikirim',             interval '3 days',
  ARRAY['Velg Racing Bronze 10 Spoke Ring 17 Set 4'], ARRAY[1]);
SELECT pg_temp.seed_order('rizky@modifkan.test', 'Speedshop ID', 'diproses',            interval '2 days',
  ARRAY['Wing GT Belakang Carbon Look Adjustable'], ARRAY[1]);
SELECT pg_temp.seed_order('dewi@modifkan.test',  'Garasi Jaya',  'menunggu_pembayaran', interval '1 day',
  ARRAY['Turbocharger Kit Ball Bearing Universal'], ARRAY[1]);
SELECT pg_temp.seed_order('bagas@modifkan.test', 'Speedshop ID', 'dibatalkan',          interval '5 days',
  ARRAY['Headlamp Angel Eyes Projector Sepasang'], ARRAY[1]);
SELECT pg_temp.seed_order('rizky@modifkan.test', 'Kaki Kuat',    'menunggu_pembayaran', interval '3 hours',
  ARRAY['Piringan Rem Drilled-Slotted + Wheel Spacer'], ARRAY[1]);

-- Alamat: satu alamat untuk Rizky, dan salinannya (snapshot) di order buyer yang sudah punya data pengiriman
INSERT INTO addresses (buyer_id, recipient, phone, address, city, postal_code)
SELECT id, 'Rizky Aditya', '081200000002', 'Jl. Dago No. 25, RT 03 RW 05, Coblong', 'Bandung', '40135'
FROM users WHERE email = 'rizky@modifkan.test';

UPDATE orders o
SET shipping_recipient = 'Rizky Aditya', shipping_phone = '081200000002',
    shipping_address = 'Jl. Dago No. 25, RT 03 RW 05, Coblong', shipping_city = 'Bandung', shipping_postal_code = '40135'
FROM users u WHERE u.id = o.buyer_id AND u.email = 'rizky@modifkan.test';

UPDATE orders o
SET shipping_recipient = 'Dewi Lestari', shipping_phone = '081200000008',
    shipping_address = 'Jl. Melati Raya No. 8, Kebayoran Baru', shipping_city = 'Jakarta Selatan', shipping_postal_code = '12120'
FROM users u WHERE u.id = o.buyer_id AND u.email = 'dewi@modifkan.test' AND o.status = 'selesai';

-- Ulasan: hanya untuk item pada order berstatus selesai
INSERT INTO reviews (order_item_id, product_id, buyer_id, rating, comment, created_at)
SELECT oi.id, oi.product_id, o.buyer_id, v.rating, v.comment, o.created_at + interval '3 days'
FROM (VALUES
  ('rizky@modifkan.test', 'Oli Mesin Full Synthetic 0W-40 4 Liter',          5, 'Segel utuh, barang asli. Mesin terasa lebih halus setelah ganti oli.'),
  ('rizky@modifkan.test', 'Tip Knalpot Ganda Stainless Hitam Glossy',        4, 'Finishing rapi dan pemasangan gampang. Warna sedikit lebih gelap dari foto.'),
  ('rizky@modifkan.test', 'Coilover Racing Pegas Merah Set 4 Roda',          3, 'Handling jelas lebih tajam, tapi di jalan rusak terasa cukup keras. Pengiriman cepat.'),
  ('dewi@modifkan.test',  'Setir Racing Carbon Look 14 Inci',                5, 'Cengkeraman enak dan tampilannya persis seperti di foto. Recommended!'),
  ('dewi@modifkan.test',  'Jok Racing Bucket Fiber Hitam Harness Merah',     4, 'Jok kokoh dan rapi jahitannya. Dus agak penyok tapi barang aman.')
) AS v(email, pname, rating, comment)
JOIN users u ON u.email = v.email
JOIN orders o ON o.buyer_id = u.id AND o.status = 'selesai'
JOIN order_items oi ON oi.order_id = o.id AND oi.product_name = v.pname;
