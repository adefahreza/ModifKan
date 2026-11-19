import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { query, closePool } from '../src/lib/db.js';

test('dua penambahan cart bersamaan tidak melebihi stok', { skip: !process.env.DATABASE_URL }, async () => {
  const buyerId = (await query('auth/find-user-by-email', ['dewi@modifkan.test'])).rows[0].id;
  const product = (await query('products/list-public', ['Spoiler Bagasi Ducktail', null])).rows[0];
  try {
    for (let round = 0; round < 5; round++) {
      await query('cart/clear', [buyerId]);
      await query('testing/set-stock', [product.id, 5]);
      await Promise.all([query('cart/add', [buyerId, product.id, 3]), query('cart/add', [buyerId, product.id, 3])]);
      const { rows } = await query('cart/list', [buyerId]);
      assert.ok(rows[0].qty <= 5, `putaran ${round}: qty ${rows[0].qty} melebihi stok 5`);
    }
  } finally {
    await query('cart/clear', [buyerId]);
    await query('testing/set-stock', [product.id, product.stock]);
  }
});
after(() => closePool?.());
