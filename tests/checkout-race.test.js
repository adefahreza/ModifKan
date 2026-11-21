import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { query, withTransaction, closePool } from '../src/lib/db.js';
import { planCheckout } from '../src/lib/cart-rules.js';

class CheckoutError extends Error {}

// Tiruan isi transaksi di checkoutAction (action-nya sendiri butuh cookie/konteks Next.js).
function checkout(buyerId) {
  return withTransaction(async (tx) => {
    const { rows: [{ count }] } = await tx.query('cart/count-rows', [buyerId]);
    const { rows } = await tx.query('orders/lock-cart-products', [buyerId]);
    const plan = planCheckout(rows, count);
    if (plan.error) throw new CheckoutError(plan.error);
    for (const order of plan.orders) {
      for (const item of order.items) {
        const dec = await tx.query('orders/decrease-stock', [item.productId, item.qty]);
        if (dec.rowCount === 0) throw new CheckoutError('Stok tidak mencukupi');
      }
      const { rows: [{ id }] } = await tx.query('orders/create', [buyerId, order.storeId, order.total, null, null, null, null, null]);
      for (const item of order.items) await tx.query('orders/create-item', [id, item.productId, item.name, item.price, item.qty]);
    }
    await tx.query('cart/clear', [buyerId]);
    return plan.orders.length;
  }).then(() => 'ok', (err) => { if (err instanceof CheckoutError) return err.message; throw err; });
}

test('dua checkout bersamaan dari buyer yang sama hanya membuat satu set order', { skip: !process.env.DATABASE_URL }, async () => {
  const buyerId = (await query('auth/find-user-by-email', ['rizky@modifkan.test'])).rows[0].id;
  const product = (await query('products/list-public', ['Oli Mesin Full Synthetic', null, null, null, 'terbaru', null])).rows[0];
  const { rows: [{ max_id: maxOrderId }] } = await query('testing/max-order-id');
  try {
    for (let round = 0; round < 5; round++) {
      await query('testing/set-stock', [product.id, 40]);
      await query('cart/clear', [buyerId]);
      await query('cart/add', [buyerId, product.id, 2]);

      const results = await Promise.all([checkout(buyerId), checkout(buyerId)]);

      assert.deepEqual([...results].sort(), ['Keranjang kosong', 'ok'], `putaran ${round}: ${results}`);
      const { rows: [after] } = await query('products/find-public', [product.id]);
      assert.equal(after.stock, 38, `putaran ${round}: stok hanya boleh berkurang 2`);
      await query('testing/delete-orders-after', [buyerId, maxOrderId]);
    }
  } finally {
    await query('testing/delete-orders-after', [buyerId, maxOrderId]);
    await query('cart/clear', [buyerId]);
    await query('testing/set-stock', [product.id, product.stock]);
  }
});
after(() => closePool?.());
