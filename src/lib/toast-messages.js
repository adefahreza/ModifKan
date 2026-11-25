export const TOASTS = {
  'produk-disimpan': 'Produk disimpan',
  'produk-dihapus': 'Produk dihapus',
  'toko-disimpan': 'Perubahan toko tersimpan',
  'pesanan-dibuat': 'Pesanan berhasil dibuat',
  'status-diperbarui': 'Status pesanan diperbarui',
  'profil-disimpan': 'Profil disimpan',
  'foto-profil-disimpan': 'Foto profil disimpan',
  'foto-profil-dihapus': 'Foto profil dihapus',
  'alamat-disimpan': 'Alamat disimpan',
  'alamat-dihapus': 'Alamat dihapus',
  'pengguna-disimpan': 'Pengguna disimpan',
  'pengguna-dihapus': 'Pengguna dihapus',
  'kategori-dihapus': 'Kategori dihapus',
  'wishlist-disimpan': 'Disimpan ke wishlist',
  'wishlist-dihapus': 'Dihapus dari wishlist',
  'keranjang-ditambah': 'Ditambahkan ke keranjang',
  'keranjang-diperbarui': 'Jumlah diperbarui',
  'keranjang-dihapus': 'Produk dihapus dari keranjang',
  'password-diubah': 'Password diubah',
  'ulasan-terkirim': 'Ulasan terkirim',
  'kategori-ditambah': 'Kategori ditambahkan',
  'kategori-disimpan': 'Kategori disimpan',
  'seller-disetujui': 'Seller disetujui',
  'seller-ditolak': 'Seller ditolak',
  'seller-ditangguhkan': 'Seller ditangguhkan',
  'seller-diaktifkan': 'Seller diaktifkan kembali',
  'akun-dihapus': 'Akun Anda telah dihapus',
};

// Hanya kunci milik sendiri yang dikenali, supaya ?toast=toString atau __proto__ tidak lolos.
export function toastMessage(key) {
  if (typeof key !== 'string') return null;
  return Object.hasOwn(TOASTS, key) ? TOASTS[key] : null;
}
