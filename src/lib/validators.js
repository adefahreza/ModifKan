import { groupThousands } from './format.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+62|62|0)8\d{7,12}$/;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const str = (v) => (typeof v === 'string' ? v : '');

export function normalizeEmail(value) {
  return str(value).trim().toLowerCase();
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

export function required(value, label) {
  return str(value).trim() === '' ? `${label} wajib diisi` : null;
}

export function isEmail(value) {
  return EMAIL_RE.test(str(value)) ? null : 'Format email tidak valid';
}

export function minLength(value, n, label) {
  return str(value).length < n ? `${label} minimal ${n} karakter` : null;
}

export function maxLength(value, n, label) {
  return str(value).length > n ? `${label} maksimal ${n} karakter` : null;
}

// bcrypt hanya memakai 72 byte pertama; huruf non-ASCII/emoji bisa lebih dari 1 byte.
export function maxBytes(value, n, label) {
  return new TextEncoder().encode(str(value)).length > n ? `${label} terlalu panjang` : null;
}

export function isPhone(value) {
  const cleaned = str(value).replace(/[\s-]/g, '');
  return PHONE_RE.test(cleaned) ? null : 'Nomor HP tidak valid (contoh: 081234567890)';
}

export function intInRange(value, min, max, label) {
  const s = str(value).trim();
  if (!/^-?\d+$/.test(s)) return `${label} harus bilangan bulat`;
  const n = Number(s);
  if (n < min || n > max) return `${label} harus antara ${groupThousands(min)} dan ${groupThousands(max)}`;
  return null;
}

export function isImageFile(file, { required: isRequired = false } = {}) {
  if (!file || !file.size) return isRequired ? 'Gambar wajib diunggah' : null;
  if (!IMAGE_TYPES.includes(file.type)) return 'Format gambar harus JPG, PNG, atau WEBP';
  if (file.size > MAX_IMAGE_BYTES) return 'Ukuran gambar maksimal 2 MB';
  return null;
}

export function validateAvatar(file) {
  const msg = !file || !file.size ? 'Pilih foto terlebih dahulu' : isImageFile(file);
  return msg ? { avatar: msg } : {};
}

const first = (...checks) => checks.find((e) => e) ?? null;

export function validateRegister(input) {
  const role = str(input.role);
  const values = {
    role,
    name: str(input.name).trim(),
    email: normalizeEmail(input.email),
    phone: str(input.phone).replace(/[\s-]/g, ''),
    password: str(input.password),
    confirmPassword: str(input.confirmPassword),
    storeName: role === 'seller' ? str(input.storeName).trim() : null,
  };
  const errors = {};
  const set = (field, msg) => { if (msg) errors[field] = msg; };

  if (!['buyer', 'seller'].includes(role)) set('role', 'Peran tidak valid');
  set('name', first(required(values.name, 'Nama'), maxLength(values.name, 100, 'Nama')));
  set('email', first(required(values.email, 'Email'), isEmail(values.email), maxLength(values.email, 255, 'Email')));
  set('phone', first(required(values.phone, 'Nomor HP'), isPhone(values.phone)));
  set('password', first(
    values.password === '' ? 'Password wajib diisi' : null,
    minLength(values.password, 8, 'Password'),
    maxBytes(values.password, 72, 'Password'),
  ));
  if (values.confirmPassword !== values.password) errors.confirmPassword = 'Konfirmasi password tidak sama';
  if (role === 'seller') {
    set('storeName', first(required(values.storeName, 'Nama toko'), maxLength(values.storeName, 100, 'Nama toko')));
  }
  return { values, errors };
}

export function validateLogin(input) {
  const values = { email: normalizeEmail(input.email), password: str(input.password) };
  const errors = {};
  const e = required(values.email, 'Email');
  if (e) errors.email = e;
  if (values.password === '') errors.password = 'Password wajib diisi';
  return { values, errors };
}

export function validateCategory(input) {
  const values = { name: str(input.name).trim() };
  const errors = {};
  const e = first(required(values.name, 'Nama kategori'), maxLength(values.name, 150, 'Nama kategori'));
  if (e) errors.name = e;
  return { values, errors };
}

export function validateStore(input) {
  const description = str(input.description).trim();
  const values = { name: str(input.name).trim(), description: description === '' ? null : description };
  const errors = {};
  const set = (field, msg) => { if (msg) errors[field] = msg; };
  set('name', first(required(values.name, 'Nama toko'), maxLength(values.name, 100, 'Nama toko')));
  set('image', isImageFile(input.image));
  return { values, errors };
}

// "10.000" / "1.250.000" -> "10000" / "1250000". Pola lain dibiarkan agar tetap ditolak.
function normalizeThousands(value) {
  return /^\d{1,3}(\.\d{3})+$/.test(value) ? value.replace(/\./g, '') : value;
}

export function validateProduct(input, { isEdit = false } = {}) {
  const values = {
    name: str(input.name).trim(),
    description: str(input.description).trim(),
    price: normalizeThousands(str(input.price).trim()),
    stock: str(input.stock).trim(),
    categoryId: str(input.categoryId).trim(),
  };
  const errors = {};
  const set = (field, msg) => { if (msg) errors[field] = msg; };
  set('name', first(required(values.name, 'Nama produk'), maxLength(values.name, 150, 'Nama produk')));
  set('description', required(values.description, 'Deskripsi'));
  set('price', first(required(values.price, 'Harga'), intInRange(values.price, 1000, 1000000000, 'Harga')));
  set('stock', first(required(values.stock, 'Stok'), intInRange(values.stock, 0, 100000, 'Stok')));
  if (!/^\d+$/.test(values.categoryId) || Number(values.categoryId) < 1) errors.categoryId = 'Kategori wajib dipilih';
  set('image', isImageFile(input.image, { required: !isEdit }));
  if (!errors.price) values.price = Number(values.price);
  if (!errors.stock) values.stock = Number(values.stock);
  if (!errors.categoryId) values.categoryId = Number(values.categoryId);
  return { values, errors };
}

export function validateUserEdit(input) {
  const values = {
    name: str(input.name).trim(),
    email: normalizeEmail(input.email),
    phone: str(input.phone).replace(/[\s-]/g, ''),
  };
  const errors = {};
  const set = (field, msg) => { if (msg) errors[field] = msg; };
  set('name', first(required(values.name, 'Nama'), maxLength(values.name, 100, 'Nama')));
  set('email', first(required(values.email, 'Email'), isEmail(values.email), maxLength(values.email, 255, 'Email')));
  set('phone', first(required(values.phone, 'Nomor HP'), isPhone(values.phone)));
  return { values, errors };
}

export function validateReview(input) {
  const raw = str(input.rating).trim();
  const rating = /^[1-5]$/.test(raw) ? Number(raw) : null;
  const values = { rating, comment: str(input.comment).trim() };
  const errors = {};
  const set = (field, msg) => { if (msg) errors[field] = msg; };
  set('rating', raw === '' ? 'Rating wajib dipilih' : rating === null ? 'Rating harus antara 1 dan 5' : null);
  set('comment', first(required(values.comment, 'Komentar'), maxLength(values.comment, 1000, 'Komentar')));
  return { values, errors };
}

export function validatePasswordChange(input) {
  const values = {
    oldPassword: str(input.oldPassword),
    newPassword: str(input.newPassword),
    confirmPassword: str(input.confirmPassword),
  };
  const errors = {};
  const set = (field, msg) => { if (msg) errors[field] = msg; };
  set('oldPassword', values.oldPassword === '' ? 'Password lama wajib diisi' : null);
  set('newPassword', first(
    values.newPassword === '' ? 'Password baru wajib diisi' : null,
    minLength(values.newPassword, 8, 'Password'),
    maxBytes(values.newPassword, 72, 'Password'),
  ));
  if (values.confirmPassword !== values.newPassword) errors.confirmPassword = 'Konfirmasi password tidak sama';
  return { values, errors };
}

export function validateAddress(input) {
  const values = {
    recipient: str(input.recipient).trim(),
    phone: str(input.phone).replace(/[\s-]/g, ''),
    address: str(input.address).trim(),
    city: str(input.city).trim(),
    postalCode: str(input.postalCode).trim(),
  };
  const errors = {};
  const set = (field, msg) => { if (msg) errors[field] = msg; };
  set('recipient', first(required(values.recipient, 'Nama penerima'), maxLength(values.recipient, 100, 'Nama penerima')));
  set('phone', first(required(values.phone, 'Nomor HP'), isPhone(values.phone)));
  set('address', first(required(values.address, 'Alamat'), minLength(values.address, 10, 'Alamat'), maxLength(values.address, 500, 'Alamat')));
  set('city', first(required(values.city, 'Kota'), maxLength(values.city, 100, 'Kota')));
  if (!/^\d{5}$/.test(values.postalCode)) errors.postalCode = 'Kode pos harus 5 digit';
  return { values, errors };
}
