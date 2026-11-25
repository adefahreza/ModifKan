import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { requireRoleApi } from '@/lib/auth';
import { UPLOAD_DIR, isKtpName, contentTypeFor } from '../../../../lib/upload.js';

// Foto KTP seller: hanya admin, tidak di-cache (berbeda dengan /api/images yang publik).
export async function GET(_request, { params }) {
  const { response } = await requireRoleApi('admin');
  if (response) return response;
  const { path: segments } = await params;
  const name = segments.join('/');
  if (!isKtpName(name)) return new Response('Not found', { status: 404 });
  try {
    const data = await readFile(path.join(UPLOAD_DIR, name));
    return new Response(data, {
      headers: { 'Content-Type': contentTypeFor(name), 'Cache-Control': 'private, no-store' },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
