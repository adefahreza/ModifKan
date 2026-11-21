import { query } from '@/lib/db';
import { requireRoleApi } from '@/lib/auth';
import { parseProductIdBody } from '@/lib/cart-rules';

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request) {
  const auth = await requireRoleApi('buyer');
  if (auth.response) return auth.response;
  const parsed = parseProductIdBody(await readBody(request));
  if (parsed.error) return Response.json({ error: parsed.error }, { status: 400 });

  const added = await query('wishlist/add', [auth.user.id, parsed.productId]);
  if (added.rowCount === 0) {
    // 0 baris = sudah tersimpan (tetap 200) atau produk tidak publik (404).
    const { rows } = await query('wishlist/ids', [auth.user.id]);
    if (!rows.some((r) => r.product_id === parsed.productId)) {
      return Response.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }
  }
  return Response.json({ saved: true });
}

export async function DELETE(request) {
  const auth = await requireRoleApi('buyer');
  if (auth.response) return auth.response;
  const parsed = parseProductIdBody(await readBody(request));
  if (parsed.error) return Response.json({ error: parsed.error }, { status: 400 });

  await query('wishlist/remove', [auth.user.id, parsed.productId]);
  return Response.json({ saved: false });
}
