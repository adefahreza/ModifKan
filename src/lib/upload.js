import { mkdir, writeFile, unlink } from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';

export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

const SAFE_NAME = /^(seed\/)?[a-z0-9-]+\.(jpg|png|webp|svg)$/;
// Foto KTP: hanya disajikan lewat /api/ktp (khusus admin), tidak lewat /api/images.
const KTP_NAME = /^ktp\/[a-f0-9]{32}\.(jpg|png|webp)$/;
const SEED_KTP = 'seed/ktp-contoh.svg';
const EXT_BY_TYPE = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const TYPE_BY_EXT = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', svg: 'image/svg+xml' };

export function isSafeImageName(name) {
  if (typeof name !== 'string' || !SAFE_NAME.test(name)) return false;
  return !name.endsWith('.svg') || name.startsWith('seed/');
}

export function isKtpName(name) {
  return typeof name === 'string' && (KTP_NAME.test(name) || name === SEED_KTP);
}

export function extFromType(mime) {
  return EXT_BY_TYPE[mime] ?? null;
}

export function contentTypeFor(name) {
  return TYPE_BY_EXT[String(name).split('.').pop()] ?? 'application/octet-stream';
}

// dir 'ktp' -> uploads/ktp/<acak>.<ext>, nama yang dikembalikan "ktp/<acak>.<ext>".
export async function saveImage(file, { dir } = {}) {
  const prefix = dir === 'ktp' ? 'ktp/' : '';
  await mkdir(path.join(UPLOAD_DIR, prefix), { recursive: true });
  const name = `${prefix}${crypto.randomBytes(16).toString('hex')}.${extFromType(file.type)}`;
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return name;
}

export async function deleteImage(name) {
  if (!(isSafeImageName(name) || isKtpName(name)) || name.startsWith('seed/')) return;
  try {
    await unlink(path.join(UPLOAD_DIR, name));
  } catch (err) {
    console.error('deleteImage gagal:', err.message);
  }
}
