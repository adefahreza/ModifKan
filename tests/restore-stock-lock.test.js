import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { query, withTransaction, closePool } from '../src/lib/db.js';

// restore-stock harus mengunci produk berurutan id menaik (sama seperti lock-cart-products),
// supaya dua transaksi yang menyentuh produk yang sama tidak saling deadlock.
test('restore-stock mengunci produk berurutan id', { skip: !process.env.DATABASE_URL }, async () => {
  // Bagas, bukan Rizky: checkout-race.test.js berjalan paralel dan menghapus order baru milik Rizky.
  const buyerId = (await query('auth/find-user-by-email', ['bagas@modifkan.test'])).rows[0].id;
  const products = (await query('products/list-public', [null, null])).rows;
  const [a, b] = [...products].sort((x, y) => x.id - y.id).slice(0, 2);
  const { rows: [{ max_id: maxOrderId }] } = await query('testing/max-order-id');

  // Item disimpan B dulu lalu A, dan baris A dipindah ke akhir heap, supaya urutan alami = B, A.
  const { rows: [{ id: orderId }] } = await query('orders/create', [buyerId, b.store_id, 0, null, null, null, null, null]);
  await query('orders/create-item', [orderId, b.id, b.name, b.price, 1]);
  await query('orders/create-item', [orderId, a.id, a.name, a.price, 1]);
  await query('testing/set-stock', [a.id, a.stock]);

  let releaseB;
  const holdB = new Promise((r) => { releaseB = r; });
  let lockedB;
  const bLocked = new Promise((r) => { lockedB = r; });
  try {
    const holder = withTransaction(async (tx) => {
      await tx.query('testing/lock-product', [b.id]);
      lockedB();
      await holdB;
    });
    await bLocked;
    const restorer = withTransaction((tx) => tx.query('orders/restore-stock', [orderId]));
    // Tunggu sampai restore benar-benar tertahan kunci (bukan sekadar jeda waktu).
    for (let i = 0; i < 100; i++) {
      const { rows: [{ count }] } = await query('testing/count-lock-waiters', ['UPDATE products p']);
      if (count > 0) break;
      await new Promise((r) => setTimeout(r, 20));
    }

    // Kalau urutannya benar, restore sudah memegang A dan sedang menunggu B.
    const probe = await withTransaction((tx) => tx.query('testing/lock-product-nowait', [a.id]))
      .then(() => 'A bebas', (err) => err.code);
    releaseB();
    await Promise.all([holder, restorer]);
    assert.equal(probe, '55P03', 'restore-stock harus mengunci A (id kecil) sebelum B');
  } finally {
    releaseB();
    await query('testing/delete-orders-after', [buyerId, maxOrderId]);
    await query('testing/set-stock', [a.id, a.stock]);
    await query('testing/set-stock', [b.id, b.stock]);
  }
});
after(() => closePool?.());
