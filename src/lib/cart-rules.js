const INVALID = { error: 'Data keranjang tidak valid' };

function isInt(n, min, max) {
  return Number.isInteger(n) && n >= min && n <= max;
}

export function parseCartBody(body) {
  if (!body || typeof body !== 'object') return { ...INVALID };
  const { productId, qty } = body;
  if (!isInt(productId, 1, 2147483647) || !isInt(qty, 1, 100000)) return { ...INVALID };
  return { productId, qty };
}

export function parseProductIdBody(body) {
  if (!body || typeof body !== 'object') return { error: 'Data tidak valid' };
  const { productId } = body;
  if (!isInt(productId, 1, 2147483647)) return { error: 'Data tidak valid' };
  return { productId };
}

export function groupCartByStore(rows) {
  const byStore = new Map();
  let total = 0;
  let itemCount = 0;
  let hasStockIssue = false;

  for (const row of rows) {
    const unavailable = row.store_status !== undefined && row.store_status !== 'approved';
    const subtotal = row.price * row.qty;
    const overStock = row.qty > row.stock;
    if (!byStore.has(row.store_id)) {
      byStore.set(row.store_id, { storeId: row.store_id, storeName: row.store_name, items: [], subtotal: 0 });
    }
    const group = byStore.get(row.store_id);
    group.items.push({ ...row, subtotal, overStock, unavailable });
    if (unavailable) {
      hasStockIssue = true;
      continue;
    }
    group.subtotal += subtotal;
    total += subtotal;
    itemCount += row.qty;
    if (overStock) hasStockIssue = true;
  }

  return { groups: [...byStore.values()], total, itemCount, hasStockIssue };
}

export function planCheckout(rows, cartCount) {
  if (rows.length === 0) return { error: 'Keranjang kosong' };
  if (rows.length < cartCount) return { error: 'Ada produk yang tidak lagi tersedia. Periksa keranjang Anda.' };

  const short = rows.find((r) => r.qty > r.stock);
  if (short) return { error: `Stok ${short.name} tidak mencukupi (sisa ${short.stock})` };

  const byStore = new Map();
  for (const r of rows) {
    if (!byStore.has(r.store_id)) byStore.set(r.store_id, { storeId: r.store_id, total: 0, items: [] });
    const order = byStore.get(r.store_id);
    order.items.push({ productId: r.product_id, name: r.name, price: r.price, qty: r.qty });
    order.total += r.price * r.qty;
  }
  return { orders: [...byStore.values()] };
}

// Pesan 409 untuk POST /api/cart; null kalau penambahan masih muat di stok.
export function addStockError(stock, inCart, qty) {
  if (inCart + qty <= stock) return null;
  if (stock <= 0) return 'Stok tidak mencukupi (stok habis)';
  if (inCart >= stock) return `Stok tidak mencukupi (sudah ada ${inCart} di keranjang)`;
  return `Stok tidak mencukupi (sisa ${stock - inCart} lagi yang bisa ditambahkan)`;
}
