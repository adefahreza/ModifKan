# ModifKan

Marketplace multi-toko untuk sparepart dan part modifikasi mobil. Penjual mendaftar, ditinjau Admin, lalu berjualan. Pembeli bisa memasukkan produk dari banyak toko ke satu keranjang, checkout, memantau status pesanan, dan memberi ulasan setelah pesanan selesai.

Tugas akhir mata kuliah Pemrograman Web.

## Fitur

**Guest**
- Beranda, daftar produk, detail produk, dan pencarian.
- Daftar sebagai Pembeli atau Penjual, lalu masuk.

**Pembeli**
- Keranjang yang dikelompokkan per toko.
- Checkout: satu pesanan untuk setiap toko, stok berkurang dalam satu transaksi.
- Riwayat dan detail pesanan, batalkan pesanan, konfirmasi pesanan diterima.
- Rating dan ulasan untuk pesanan yang sudah selesai.
- Ubah profil dan password.

**Penjual**
- Status toko Pending, Approved, atau Rejected. Akun Rejected bisa dihapus lalu daftar ulang.
- Dashboard ringkasan, pengaturan toko, CRUD produk beserta unggah gambar.
- Mengelola pesanan masuk: konfirmasi, kirim, atau batalkan.

**Admin**
- Verifikasi penjual.
- Mengelola pengguna dan kategori.
- Moderasi produk dan pemantauan semua pesanan.

**Fitur tambahan**
- Filter kategori, rentang harga, dan pengurutan produk.
- Wishlist.
- Alamat pengiriman, dipilih saat checkout dan disalin ke pesanan.

Alur status pesanan:

```
Menunggu Pembayaran → Diproses → Dikirim → Selesai
Menunggu Pembayaran → Dibatalkan (stok dikembalikan)
```

Tidak ada pembayaran sungguhan maupun ongkos kirim.

## Teknologi

- Next.js 16 App Router (JSX, tanpa TypeScript)
- Tailwind CSS 4
- PostgreSQL dengan driver `pg` (Raw SQL, tanpa ORM)
- bcryptjs, lucide-react

## Persyaratan

- Node.js 22.9 atau lebih baru (dikembangkan dengan 26.7.0)
- PostgreSQL (dikembangkan dengan 18.6) dan pgAdmin 4

## Cara menjalankan

### 1. Clone repository

```bash
git clone https://github.com/adefahreza/ModifKan.git
cd ModifKan
```

### 2. Siapkan database di pgAdmin

1. Klik kanan **Databases** → **Create** → **Database…**, beri nama `modifkan`, lalu **Save**.
2. Klik database `modifkan`, lalu buka **Query Tool**.
3. Buka file `db/schema.sql`, lalu jalankan (F5).
4. Buka file `db/seed.sql`, lalu jalankan (F5).

> `schema.sql` menghapus tabel lama sebelum membuatnya kembali, jadi semua data di database tersebut akan hilang.

### 3. Atur koneksi database

Salin `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Lalu isi `USER` dan `PASSWORD` sesuai akun PostgreSQL Anda:

```
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/modifkan
```

### 4. Install dan jalankan

```bash
npm install
```

```bash
npm run dev
```

Buka `http://localhost:3000`.

Untuk mode production:

```bash
npm run build
```

```bash
npm start
```

### Alternatif pengisian database

Setelah database `modifkan` dibuat dan `.env.local` diisi, `schema.sql` dan `seed.sql` bisa dijalankan sekaligus. Perintah ini **menghapus semua data** di database tersebut.

```bash
npm run db:reset
```

## Akun demo

| Peran | Email | Password |
|---|---|---|
| Admin | `admin@modifkan.test` | `admin12345` |
| Pembeli | `rizky@modifkan.test` | `modifkan123` |
| Pembeli | `dewi@modifkan.test` | `modifkan123` |
| Pembeli | `bagas@modifkan.test` | `modifkan123` |
| Penjual (Approved, Garasi Jaya) | `garasijaya@modifkan.test` | `modifkan123` |
| Penjual (Approved, Speedshop ID) | `speedshop@modifkan.test` | `modifkan123` |
| Penjual (Approved, Kaki Kuat) | `kakikuat@modifkan.test` | `modifkan123` |
| Penjual (Pending) | `turbolokal@modifkan.test` | `modifkan123` |
| Penjual (Rejected) | `bengkelasal@modifkan.test` | `modifkan123` |

## Struktur folder

```
db/
  schema.sql          tabel dan relasi
  seed.sql            data awal dan akun demo
  queries/            query aplikasi: <domain>/<aksi>.sql
src/
  app/
    (shop)/           beranda, produk, keranjang, checkout
    (auth)/           masuk dan daftar
    account/          halaman Pembeli
    seller/           dashboard Penjual dan halaman status toko
    admin/            dashboard Admin
    api/              route handler: cart, wishlist, images
    403/              halaman tanpa akses
  components/         komponen UI, toko, dashboard, pesanan, akun
  lib/                koneksi database, auth, validasi, server action
  proxy.js            cek cookie session untuk halaman privat
public/icons/         ikon kategori
uploads/              gambar unggahan (hanya uploads/seed/ yang disimpan di repo)
scripts/              reset database dan pengambilan foto seed
tests/                unit test
e2e/                  tes browser (Playwright)
```

## Catatan teknis

- Semua SQL ada di folder `db/`, satu perintah per file query, dengan parameter `$1…`. Query dipanggil lewat `query('domain/aksi', params)` atau `withTransaction(...)`.
- Validasi ditulis manual di `src/lib/validators.js` dan dijalankan di server.
- Setiap aksi privat memeriksa peran di server, dan kepemilikan data dicek di query.
- Session disimpan di tabel `sessions` dan dikirim lewat cookie `httpOnly`. Password di-hash dengan bcryptjs.
- Gambar disimpan di `uploads/` dan disajikan lewat `GET /api/images/...` (publik, hanya baca).
- Unit test: `npm test` (memakai database pada `.env.local`).
