import { mkdir, writeFile, unlink } from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';

export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

const SAFE_NAME = /^(seed\/)?[a-z0-9-]+\.(jpg|png|webp|svg)$/;
const EXT_BY_TYPE = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const TYPE_BY_EXT = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', svg: 'image/svg+xml' };

export function isSafeImageName(name) {
  if (typeof name !== 'string' || !SAFE_NAME.test(name)) return false;
  return !name.endsWith('.svg') || name.startsWith('seed/');
}

export function extFromType(mime) {
  return EXT_BY_TYPE[mime] ?? null;
}

export function contentTypeFor(name) {
  return TYPE_BY_EXT[String(name).split('.').pop()] ?? 'application/octet-stream';
}

export async function saveImage(file) {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${crypto.randomBytes(16).toString('hex')}.${extFromType(file.type)}`;
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return name;
}

export async function deleteImage(name) {
  if (!isSafeImageName(name) || name.startsWith('seed/')) return;
  try {
    await unlink(path.join(UPLOAD_DIR, name));
  } catch (err) {
    console.error('deleteImage gagal:', err.message);
  }
}
