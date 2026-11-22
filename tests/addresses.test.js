import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { query, closePool } from '../src/lib/db.js';

test('alamat: CRUD hanya untuk pemilik', { skip: !process.env.DATABASE_URL }, async () => {
  const rizky = (await query('auth/find-user-by-email', ['rizky@modifkan.test'])).rows[0].id;
  const dewi = (await query('auth/find-user-by-email', ['dewi@modifkan.test'])).rows[0].id;
  const { id } = (await query('addresses/create', [rizky, 'Uji', '081234567890', 'Jl. Uji No. 1, Bandung', 'Bandung', '40115'])).rows[0];
  try {
    assert.equal((await query('addresses/find', [id, rizky])).rows.length, 1);
    assert.equal((await query('addresses/find', [id, dewi])).rows.length, 0, 'buyer lain tidak bisa melihat');
    assert.equal((await query('addresses/update', [id, dewi, 'X', '081234567890', 'Jl. Peretas No. 9', 'Y', '11111'])).rowCount, 0);
    assert.equal((await query('addresses/update', [id, rizky, 'Uji 2', '081234567890', 'Jl. Uji No. 2, Bandung', 'Bandung', '40116'])).rowCount, 1);
    assert.equal((await query('addresses/find', [id, rizky])).rows[0].recipient, 'Uji 2');
    assert.equal((await query('addresses/delete', [id, dewi])).rowCount, 0, 'buyer lain tidak bisa menghapus');
    assert.ok((await query('addresses/list', [rizky])).rows.some((r) => r.id === id));
    assert.equal((await query('addresses/delete', [id, rizky])).rowCount, 1);
  } finally {
    await query('addresses/delete', [id, rizky]);
  }
});
after(() => closePool?.());
