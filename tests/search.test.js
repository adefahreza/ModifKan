import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { query, closePool } from '../src/lib/db.js';

test('pencarian: % dan _ dicari sebagai teks biasa', { skip: !process.env.DATABASE_URL }, async () => {
  for (const q of ['%', '_', '50%', 'velg_']) {
    const { rows } = await query('products/list-public', [q, null]);
    assert.equal(rows.length, 0, `"${q}" tidak boleh menjadi wildcard`);
  }
  assert.ok((await query('products/list-public', ['velg', null])).rows.length > 0);
});
after(() => closePool?.());
