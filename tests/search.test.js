import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { query, closePool } from '../src/lib/db.js';

test('pencarian: % dan _ dicari sebagai teks biasa', { skip: !process.env.DATABASE_URL }, async () => {
  for (const q of ['%', '_', '50%', 'velg_']) {
    const { rows } = await query('products/list-public', [q, null, null, null, 'terbaru', null]);
    assert.equal(rows.length, 0, `"${q}" tidak boleh menjadi wildcard`);
  }
  assert.ok((await query('products/list-public', ['velg', null, null, null, 'terbaru', null])).rows.length > 0);
});
test('filter harga dan sorting', { skip: !process.env.DATABASE_URL }, async () => {
  const all = (await query('products/list-public', [null, null, null, null, 'terbaru', null])).rows;
  const asc = (await query('products/list-public', [null, null, null, null, 'harga_terendah', null])).rows.map((r) => Number(r.price));
  const desc = (await query('products/list-public', [null, null, null, null, 'harga_tertinggi', null])).rows.map((r) => Number(r.price));
  assert.deepEqual(asc, [...asc].sort((a, b) => a - b));
  assert.deepEqual(desc, [...desc].sort((a, b) => b - a));
  const [lo, hi] = [asc[Math.floor(asc.length / 3)], asc[Math.floor((asc.length * 2) / 3)]];
  const ranged = (await query('products/list-public', [null, null, lo, hi, 'terbaru', null])).rows;
  assert.ok(ranged.length > 0 && ranged.length < all.length);
  assert.ok(ranged.every((r) => Number(r.price) >= lo && Number(r.price) <= hi));
});
test('filter rating minimum', { skip: !process.env.DATABASE_URL }, async () => {
  const all = (await query('products/list-public', [null, null, null, null, 'terbaru', null])).rows;
  const rated = (await query('products/list-public', [null, null, null, null, 'terbaru', 4])).rows;
  assert.ok(rated.length < all.length, 'produk tanpa ulasan atau rating rendah tidak ikut');
  assert.ok(rated.every((r) => Number(r.avg_rating) >= 4));
});
after(() => closePool?.());
