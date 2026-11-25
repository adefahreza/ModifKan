<div align="center">

<img src="public/logo-modifkan.png" alt="ModifKan" width="360">

**Marketplace multi-toko untuk sparepart dan part modifikasi mobil**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Raw_SQL-4169E1?logo=postgresql&logoColor=white)

Tugas akhir mata kuliah Pemrograman Web

</div>

Penjual mendaftar, ditinjau Admin, lalu berjualan. Pembeli bisa memasukkan produk dari banyak toko ke satu keranjang, checkout, memantau status pesanan, dan memberi ulasan setelah pesanan selesai. Tidak ada pembayaran sungguhan maupun ongkos kirim.

## Daftar isi

[Tampilan](#tampilan) · [Fitur](#fitur) · [Cara kerja](#cara-kerja) · [Database](#database) · [Cara menjalankan](#cara-menjalankan) · [Akun demo](#akun-demo) · [Struktur folder](#struktur-folder)

## Tampilan

| Beranda pembeli | Detail produk |
|---|---|
| ![Beranda pembeli](.github/readme/beranda.jpg) | ![Detail produk](.github/readme/detail-produk.jpg) |
| **Dashboard penjual** | **Verifikasi penjual (Admin)** |
| ![Dashboard penjual](.github/readme/dashboard-penjual.jpg) | ![Verifikasi penjual](.github/readme/verifikasi-seller.jpg) |

## Fitur

| Peran | Yang bisa dilakukan |
|---|---|
| **Guest** | Melihat beranda, daftar dan detail produk, pencarian, mendaftar, masuk |
| **Pembeli** | Keranjang per toko, checkout, riwayat pesanan, ulasan, wishlist, alamat, profil |
| **Penjual** | Pengaturan toko, CRUD produk, mengelola pesanan masuk |
| **Admin** | Verifikasi dan penangguhan penjual, pengguna, kategori, moderasi produk, pemantauan pesanan |

<details>
<summary><b>Rincian fitur</b></summary>

**Pembeli**
- Keranjang yang dikelompokkan per toko.
- Checkout membuat satu pesanan untuk setiap toko.
- Riwayat dan detail pesanan, batalkan pesanan, konfirmasi pesanan diterima.
- Rating dan ulasan untuk pesanan yang sudah selesai.
- Filter kategori, rentang harga, rating, dan pengurutan produk.
- Wishlist, dan alamat pengiriman yang disalin ke pesanan.
- Ubah profil, foto profil, dan password.

**Penjual**
- Daftar dengan nama toko dan foto KTP/tanda pengenal.
- Penjual yang ditolak melihat alasannya, dan akunnya bisa dihapus lalu daftar ulang.
- Penjual yang ditangguhkan melihat alasan dan nomor Customer Service (WhatsApp).
- Dashboard ringkasan, pengaturan toko, produk beserta unggah gambar.
- Ubah email dan nomor HP di halaman Edit Toko.
- Konfirmasi, kirim, atau batalkan pesanan.

**Admin**
- Melihat foto KTP, lalu Approve atau Reject dengan alasan.
- Menangguhkan penjual dengan alasan dan mengaktifkannya kembali.
- Mengelola pengguna dan kategori, menghapus produk, memantau semua pesanan.
- Profil admin: nama, email, nomor HP (kontak Customer Service), dan password.

</details>

## Cara kerja

```mermaid
flowchart LR
  B[Browser] --> P["proxy.js<br/>cek cookie session"]
  P --> N["Halaman, server action,<br/>route handler"]
  N --> A["Cek peran<br/>dan validasi"]
  A --> Q["src/db/queries/*.sql"]
  Q --> D[(PostgreSQL)]
  N --> U[/uploads/]
```

### Status pesanan

```mermaid
stateDiagram-v2
  state "Menunggu Pembayaran" as M
  [*] --> M
  M --> Diproses : penjual
  Diproses --> Dikirim : penjual
  Dikirim --> Selesai : pembeli
  M --> Dibatalkan : penjual atau pembeli
  Dibatalkan --> [*] : stok dikembalikan
  Selesai --> [*]
```

### Status penjual

```mermaid
stateDiagram-v2
  [*] --> Pending : daftar + KTP
  Pending --> Approved : Approve
  Pending --> Rejected : Reject + alasan
  Approved --> Ditangguhkan : Tangguhkan + alasan
  Ditangguhkan --> Approved : Aktifkan kembali
  Rejected --> [*] : akun dihapus
```

### Hal teknis yang dijaga
- **Checkout dalam satu transaksi:** baris keranjang dan produk dikunci (`FOR UPDATE`). Kalau satu item gagal, tidak ada pesanan yang dibuat.
- **Transisi status dijaga di SQL:** query hanya mengubah baris yang masih berada di status asal.
- **Kepemilikan dicek di query,** bukan hanya disembunyikan di tampilan.
- **Tanpa ORM:** setiap query berada di `src/db/queries/`, satu perintah per file, dengan parameter `$1…`.
- **Password** di-hash dengan bcryptjs. Session disimpan di database dan dikirim lewat cookie `httpOnly`.
- **Foto KTP** hanya disajikan ke Admin lewat `/api/ktp/...`.

<details>
<summary><b>Route API</b></summary>

Sebagian besar aksi memakai server action. Route handler hanya berikut ini:

| Route | Method | Akses | Fungsi |
|---|---|---|---|
| `/api/cart` | POST, PATCH, DELETE | Pembeli | Tambah, ubah jumlah, dan hapus isi keranjang |
| `/api/wishlist` | POST, DELETE | Pembeli | Tambah dan hapus wishlist |
| `/api/images/...` | GET | Publik | Gambar produk, toko, dan profil |
| `/api/ktp/...` | GET | Admin | Foto KTP penjual |

</details>

## Database

```mermaid
erDiagram
  users ||--o{ sessions : punya
  users ||--o| stores : memiliki
  users ||--o{ cart_items : punya
  users ||--o{ wishlist_items : punya
  users ||--o{ addresses : punya
  users |o--o{ orders : membuat
  users ||--o{ reviews : menulis
  stores ||--o{ products : menjual
  stores |o--o{ orders : menerima
  categories ||--o{ products : mengelompokkan
  products ||--o{ cart_items : ada_di
  products ||--o{ wishlist_items : ada_di
  products |o--o{ order_items : dipesan
  products ||--o{ reviews : diulas
  orders ||--|{ order_items : berisi
  order_items ||--o| reviews : dinilai
```

Definisi lengkap ada di [`src/db/schema.sql`](src/db/schema.sql).

## Cara menjalankan

**Persyaratan:** Node.js 22.9 atau lebih baru (dikembangkan dengan 26.7.0), PostgreSQL (dikembangkan dengan 18.6), dan pgAdmin 4.

### 1. Clone repository

```bash
git clone https://github.com/adefahreza/ModifKan.git
cd ModifKan
```

### 2. Siapkan database di pgAdmin

1. Klik kanan **Databases** → **Create** → **Database…**, beri nama `modifkan`, lalu **Save**.
2. Klik database `modifkan`, lalu buka **Query Tool**.
3. Buka file `src/db/schema.sql`, lalu jalankan (F5).
4. Buka file `src/db/seed.sql`, lalu jalankan (F5).

> `schema.sql` menghapus tabel lama sebelum membuatnya kembali, jadi semua data di database tersebut akan hilang.

### 3. Atur koneksi database

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

<details>
<summary><b>Mode production dan pengisian database lewat terminal</b></summary>

Mode production:

```bash
npm run build
```

```bash
npm start
```

Setelah database `modifkan` dibuat dan `.env.local` diisi, `schema.sql` dan `seed.sql` bisa dijalankan sekaligus. Perintah ini **menghapus semua data** di database tersebut.

```bash
npm run db:reset
```

</details>

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
| Penjual (Ditangguhkan, Rapid Motor) | `rapidmotor@modifkan.test` | `modifkan123` |

## Struktur folder

<details>
<summary><b>Lihat struktur</b></summary>

```
src/
  db/
    schema.sql        tabel dan relasi
    seed.sql          data awal dan akun demo
    queries/          query aplikasi: <domain>/<aksi>.sql
  app/
    (shop)/           beranda, produk, keranjang, checkout
    (auth)/           masuk dan daftar
    account/          halaman Pembeli
    seller/           dashboard Penjual dan halaman status toko
    admin/            dashboard Admin
    api/              route handler: cart, wishlist, images, ktp
    403/              halaman tanpa akses
  components/         komponen UI, toko, dashboard, pesanan, akun
  lib/                koneksi database, auth, validasi, server action
  proxy.js            cek cookie session untuk halaman privat
public/               logo README dan ikon kategori
uploads/              gambar unggahan (hanya uploads/seed/ yang disimpan di repo)
```

</details>
