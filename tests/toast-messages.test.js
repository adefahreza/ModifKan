import test from 'node:test';
import assert from 'node:assert/strict';
import { TOASTS, toastMessage } from '../src/lib/toast-messages.js';

test('toastMessage', () => {
  assert.equal(toastMessage('pesanan-dibuat'), 'Pesanan berhasil dibuat');
  assert.equal(toastMessage('akun-dihapus'), 'Akun Anda telah dihapus');
  assert.equal(toastMessage('keranjang-dihapus'), 'Produk dihapus dari keranjang');
  assert.equal(toastMessage('x'), null);
  assert.equal(toastMessage(null), null);
  assert.equal(toastMessage(undefined), null);
  assert.equal(toastMessage(['pesanan-dibuat']), null);
  assert.equal(toastMessage('toString'), null, 'kunci bawaan Object tidak boleh lolos');
  assert.equal(toastMessage('__proto__'), null);
});

test('TOASTS memuat kunci minimal dari rencana', () => {
  for (const k of ['produk-disimpan', 'produk-dihapus', 'toko-disimpan', 'pesanan-dibuat', 'status-diperbarui', 'profil-disimpan', 'alamat-disimpan', 'akun-dihapus',
    'keranjang-ditambah', 'keranjang-diperbarui', 'keranjang-dihapus', 'password-diubah', 'ulasan-terkirim',
    'kategori-ditambah', 'kategori-disimpan', 'seller-disetujui', 'seller-ditolak']) {
    assert.ok(typeof TOASTS[k] === 'string' && TOASTS[k], k);
  }
});
