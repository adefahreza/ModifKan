-- Migrasi database yang sudah berisi data (mis. modifkan) ke skema verifikasi seller.
-- Aman dijalankan ulang. Jalankan sekali lewat pgAdmin Query Tool atau:
--   psql -d modifkan -f db/migrations/2026-11-25-seller-verifikasi.sql
BEGIN;
ALTER TABLE stores DROP CONSTRAINT IF EXISTS stores_status_check;
ALTER TABLE stores ADD CONSTRAINT stores_status_check CHECK (status IN ('pending','approved','rejected','suspended'));
ALTER TABLE stores ADD COLUMN IF NOT EXISTS ktp_image TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS status_reason TEXT;
COMMIT;
