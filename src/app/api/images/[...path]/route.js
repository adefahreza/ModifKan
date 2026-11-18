import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { UPLOAD_DIR, isSafeImageName, contentTypeFor } from '../../../../lib/upload.js';

// Publik tanpa requireRole: Guest juga harus bisa melihat gambar produk. Hanya baca.
export async function GET(_request, { params }) {
  const { path: segments } = await params;
  const name = segments.join('/');
  if (!isSafeImageName(name)) return new Response('Not found', { status: 404 });
  try {
    const data = await readFile(path.join(UPLOAD_DIR, name));
    return new Response(data, {
      headers: {
        'Content-Type': contentTypeFor(name),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
