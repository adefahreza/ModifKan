import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRegister, validateLogin, isPhone, intInRange, isImageFile, normalizeEmail, hasErrors,
  validateCategory, validateStore, validateProduct, validateUserEdit, validateReview, validatePasswordChange } from '../src/lib/validators.js';

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

test('kategori', () => {
  assert.equal(validateCategory({ name: '  ' }).errors.name, 'Nama kategori wajib diisi');
  assert.equal(validateCategory({ name: 'x'.repeat(51) }).errors.name, 'Nama kategori maksimal 50 karakter');
  assert.equal(validateCategory({ name: ' Turbo ' }).values.name, 'Turbo');
});
test('produk baru valid', () => {
  const img = { size: 1000, type: 'image/png', name: 'a.png' };
  const { values, errors } = validateProduct({ name: ' Velg ', description: 'Cocok untuk: Civic', price: '4250000',
    stock: '0', categoryId: '3', image: img }, { isEdit: false });
  assert.deepEqual(errors, {});
  assert.equal(values.price, 4250000); assert.equal(values.stock, 0); assert.equal(values.categoryId, 3);
});
test('produk error per field', () => {
  const { errors } = validateProduct({ name: '', description: '', price: '999', stock: '100001', categoryId: 'abc',
    image: { size: 0 } }, { isEdit: false });
  assert.equal(errors.name, 'Nama produk wajib diisi');
  assert.equal(errors.description, 'Deskripsi wajib diisi');
  assert.equal(errors.price, 'Harga harus antara 1.000 dan 1.000.000.000');
  assert.equal(errors.stock, 'Stok harus antara 0 dan 100.000');
  assert.equal(errors.categoryId, 'Kategori wajib dipilih');
  assert.equal(errors.image, 'Gambar wajib diunggah');
});
test('edit produk tanpa gambar baru boleh', () => {
  const { errors } = validateProduct({ name: 'A', description: 'B', price: '1000', stock: '1', categoryId: '1',
    image: { size: 0 } }, { isEdit: true });
  assert.deepEqual(errors, {});
});
test('toko', () => {
  const { values, errors } = validateStore({ name: ' Garasi ', description: '  ', image: { size: 0 } });
  assert.deepEqual(errors, {}); assert.equal(values.description, null);
});
test('edit user', () => {
  const { values, errors } = validateUserEdit({ name: 'A', email: ' A@B.CO ', phone: '0812 3456 7890' });
  assert.deepEqual(errors, {}); assert.equal(values.email, 'a@b.co'); assert.equal(values.phone, '081234567890');
});

test('harga boleh bertitik pemisah ribuan', () => {
  const base = { name: 'A', description: 'B', stock: '1', categoryId: '1', image: { size: 0 } };
  const ok = (price) => validateProduct({ ...base, price }, { isEdit: true });
  assert.equal(ok('10.000').values.price, 10000);
  assert.deepEqual(ok('10.000').errors, {});
  assert.equal(ok('1.250.000').values.price, 1250000);
  assert.equal(ok('10.5').errors.price, 'Harga harus bilangan bulat');
  assert.equal(ok('1.00').errors.price, 'Harga harus bilangan bulat');
  assert.equal(ok('999').errors.price, 'Harga harus antara 1.000 dan 1.000.000.000');
});

test('ulasan', () => {
  assert.deepEqual(validateReview({ rating: '5', comment: ' Mantap, pas! ' }).values, { rating: 5, comment: 'Mantap, pas!' });
  const { errors } = validateReview({ rating: '6', comment: 'ok' });
  assert.equal(errors.rating, 'Rating harus antara 1 dan 5');
  assert.equal(errors.comment, 'Komentar minimal 5 karakter');
  assert.equal(validateReview({ rating: '', comment: 'x'.repeat(1001) }).errors.comment, 'Komentar maksimal 1000 karakter');
  assert.equal(validateReview({ rating: '', comment: 'bagus sekali' }).errors.rating, 'Rating wajib dipilih');
});

test('ganti password', () => {
  const { errors } = validatePasswordChange({ oldPassword: '', newPassword: 'pendek', confirmPassword: 'lain' });
  assert.equal(errors.oldPassword, 'Password lama wajib diisi');
  assert.equal(errors.newPassword, 'Password minimal 8 karakter');
  assert.equal(errors.confirmPassword, 'Konfirmasi password tidak sama');
  assert.deepEqual(validatePasswordChange({ oldPassword: 'a', newPassword: 'rahasia123', confirmPassword: 'rahasia123' }).errors, {});
});

test('batas password dihitung dalam byte (batas bcrypt 72 byte)', () => {
  const emoji = '😀'.repeat(20); // 40 unit JS, 80 byte
  assert.equal(validatePasswordChange({ oldPassword: 'a', newPassword: emoji, confirmPassword: emoji }).errors.newPassword, 'Password terlalu panjang');
  const ascii = 'a'.repeat(72);
  assert.equal(validatePasswordChange({ oldPassword: 'a', newPassword: ascii, confirmPassword: ascii }).errors.newPassword, undefined);
  assert.equal(validateRegister({ role: 'buyer', name: 'Budi', email: 'b@mail.com', phone: '081234567890',
    password: emoji, confirmPassword: emoji }).errors.password, 'Password terlalu panjang');
});
