import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { query, closePool } from '../src/lib/db.js';

test('wishlist: tambah, daftar, hapus, dan kepemilikan', { skip: !process.env.DATABASE_URL }, async () => {
  const rizky = (await query('auth/find-user-by-email', ['rizky@modifkan.test'])).rows[0].id;
  const dewi = (await query('auth/find-user-by-email', ['dewi@modifkan.test'])).rows[0].id;
  const [a, b] = (await query('products/list-public', [null, null, null, null, 'terbaru', null])).rows;
  try {
    await query('wishlist/remove', [rizky, a.id]);
    await query('wishlist/remove', [rizky, b.id]);
    assert.equal((await query('wishlist/add', [rizky, a.id])).rowCount, 1);
    assert.equal((await query('wishlist/add', [rizky, a.id])).rowCount, 0, 'duplikat tidak error');
    await query('wishlist/add', [rizky, b.id]);
    assert.equal((await query('wishlist/add', [rizky, 2147483647])).rowCount, 0, 'produk tidak ada/tidak publik');

    const ids = (await query('wishlist/ids', [rizky])).rows.map((r) => r.product_id);
    assert.ok(ids.includes(a.id) && ids.includes(b.id));
    const list = (await query('wishlist/list', [rizky])).rows;
    assert.ok(list.some((r) => r.id === a.id && r.name && r.category_name && r.store_name));

    await query('wishlist/remove', [dewi, a.id]);
    assert.ok((await query('wishlist/ids', [rizky])).rows.some((r) => r.product_id === a.id), 'hapus oleh buyer lain tidak berpengaruh');

    await query('wishlist/remove', [rizky, a.id]);
    assert.ok(!(await query('wishlist/ids', [rizky])).rows.some((r) => r.product_id === a.id));
  } finally {
    await query('wishlist/remove', [rizky, a.id]);
    await query('wishlist/remove', [rizky, b.id]);
  }
});
after(() => closePool?.());
