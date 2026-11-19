import { query } from '@/lib/db';
import { requireRoleApi } from '@/lib/auth';
import { addStockError, parseCartBody } from '@/lib/cart-rules';

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function cartCount(buyerId) {
  const { rows } = await query('cart/count', [buyerId]);
  return Response.json({ count: rows[0].count });
}

const notFound = () => Response.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
const invalid = (error) => Response.json({ error }, { status: 400 });
const conflict = (error) => Response.json({ error }, { status: 409 });
const noStock = (stock) => conflict(`Stok tidak mencukupi (sisa ${stock})`);

export async function POST(request) {
  const auth = await requireRoleApi('buyer');
  if (auth.response) return auth.response;
  const parsed = parseCartBody(await readBody(request));
  if (parsed.error) return invalid(parsed.error);

  const { rows } = await query('cart/find-product', [parsed.productId, auth.user.id]);
  if (!rows[0]) return notFound();
  const early = addStockError(rows[0].stock, rows[0].in_cart, parsed.qty);
  if (early) return conflict(early);

  // Penjaga stok ada di SQL (atomik); tidak ada baris = stok berubah sejak pengecekan di atas.
  const added = await query('cart/add', [auth.user.id, parsed.productId, parsed.qty]);
  if (added.rowCount === 0) {
    const fresh = (await query('cart/find-product', [parsed.productId, auth.user.id])).rows[0];
    if (!fresh) return notFound();
    return conflict(addStockError(fresh.stock, fresh.in_cart, parsed.qty) ?? 'Stok tidak mencukupi');
  }
  return cartCount(auth.user.id);
}

export async function PATCH(request) {
  const auth = await requireRoleApi('buyer');
  if (auth.response) return auth.response;
  const parsed = parseCartBody(await readBody(request));
  if (parsed.error) return invalid(parsed.error);

  const { rows } = await query('cart/find-product', [parsed.productId, auth.user.id]);
  if (!rows[0]) return notFound();
  if (parsed.qty > rows[0].stock) return noStock(rows[0].stock);

  const updated = await query('cart/set-qty', [auth.user.id, parsed.productId, parsed.qty]);
  if (updated.rowCount === 0) return notFound();
  return cartCount(auth.user.id);
}

export async function DELETE(request) {
  const auth = await requireRoleApi('buyer');
  if (auth.response) return auth.response;
  const body = await readBody(request);
  const parsed = parseCartBody(body && typeof body === 'object' ? { ...body, qty: 1 } : null);
  if (parsed.error) return invalid(parsed.error);

  await query('cart/remove', [auth.user.id, parsed.productId]);
  return cartCount(auth.user.id);
}
