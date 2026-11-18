import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRegister, validateLogin, isPhone, intInRange, isImageFile, normalizeEmail, hasErrors } from '../src/lib/validators.js';

test('register buyer valid', () => {
  const { values, errors } = validateRegister({ role: 'buyer', name: ' Budi ', email: ' Budi@Mail.com ',
    phone: '0812-3456-7890', password: ' rahasia123', confirmPassword: ' rahasia123', storeName: '' });
  assert.deepEqual(errors, {});
  assert.equal(values.email, 'budi@mail.com');
  assert.equal(values.name, 'Budi');
  assert.equal(values.phone, '081234567890');
  assert.equal(values.password, ' rahasia123');
  assert.equal(values.storeName, null);
});
test('register seller wajib nama toko', () => {
  const { errors } = validateRegister({ role: 'seller', name: 'A', email: 'a@b.co', phone: '081234567890',
    password: 'rahasia123', confirmPassword: 'rahasia123', storeName: '  ' });
  assert.equal(errors.storeName, 'Nama toko wajib diisi');
});
test('register error per field', () => {
  const { errors } = validateRegister({ role: 'admin', name: '', email: 'bukan-email', phone: '123',
    password: 'pendek', confirmPassword: 'beda', storeName: '' });
  assert.equal(errors.role, 'Peran tidak valid');
  assert.equal(errors.name, 'Nama wajib diisi');
  assert.equal(errors.email, 'Format email tidak valid');
  assert.equal(errors.phone, 'Nomor HP tidak valid (contoh: 081234567890)');
  assert.equal(errors.password, 'Password minimal 8 karakter');
  assert.equal(errors.confirmPassword, 'Konfirmasi password tidak sama');
});
test('isPhone menerima +62 dan 62', () => {
  assert.equal(isPhone('+6281234567890'), null);
  assert.equal(isPhone('6281234567890'), null);
});
test('login wajib isi', () => {
  const { errors } = validateLogin({ email: '', password: '' });
  assert.equal(errors.email, 'Email wajib diisi');
  assert.equal(errors.password, 'Password wajib diisi');
});
test('intInRange', () => {
  assert.equal(intInRange('5000', 1000, 1000000000, 'Harga'), null);
  assert.equal(intInRange('12.5', 1, 10, 'Stok'), 'Stok harus bilangan bulat');
  assert.equal(intInRange('0', 1000, 1000000000, 'Harga'), 'Harga harus antara 1.000 dan 1.000.000.000');
});
test('isImageFile', () => {
  const ok = { size: 1024, type: 'image/webp', name: 'a.webp' };
  assert.equal(isImageFile(ok, { required: true }), null);
  assert.equal(isImageFile({ size: 3 * 1024 * 1024, type: 'image/png', name: 'a.png' }, { required: true }), 'Ukuran gambar maksimal 2 MB');
  assert.equal(isImageFile({ size: 10, type: 'image/gif', name: 'a.gif' }, { required: true }), 'Format gambar harus JPG, PNG, atau WEBP');
  assert.equal(isImageFile({ size: 0, type: '', name: '' }, { required: true }), 'Gambar wajib diunggah');
  assert.equal(isImageFile({ size: 0, type: '', name: '' }, { required: false }), null);
});
test('normalizeEmail & hasErrors', () => {
  assert.equal(normalizeEmail(' Budi@Mail.COM '), 'budi@mail.com');
  assert.equal(hasErrors({}), false);
  assert.equal(hasErrors({ a: 'x' }), true);
});
