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
    maxLength(values.password, 72, 'Password'),
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
