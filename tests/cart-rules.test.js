import test from 'node:test';
import assert from 'node:assert/strict';
import { parseProductIdBody, parseCartBody, groupCartByStore, planCheckout, addStockError } from '../src/lib/cart-rules.js';

test('parseCartBody', () => {
  assert.deepEqual(parseCartBody({ productId: 3, qty: 2 }), { productId: 3, qty: 2 });
  for (const bad of [null, {}, { productId: 'x', qty: 1 }, { productId: 1, qty: 0 }, { productId: 1, qty: 1.5 }, { productId: 1, qty: -2 }])
    assert.deepEqual(parseCartBody(bad), { error: 'Data keranjang tidak valid' });
});

test('groupCartByStore', () => {
  const rows = [
    { product_id: 1, qty: 2, price: 10000, stock: 5, store_id: 7, store_name: 'Garasi Jaya' },
    { product_id: 2, qty: 3, price: 5000, stock: 1, store_id: 9, store_name: 'Kaki Kuat' },
    { product_id: 3, qty: 1, price: 1000, stock: 9, store_id: 7, store_name: 'Garasi Jaya' },
  ];
  const r = groupCartByStore(rows);
  assert.equal(r.groups.length, 2);
  assert.equal(r.groups[0].storeName, 'Garasi Jaya');
  assert.equal(r.groups[0].subtotal, 21000);
  assert.equal(r.groups[1].items[0].overStock, true);
  assert.equal(r.total, 36000);
  assert.equal(r.itemCount, 6);
  assert.equal(r.hasStockIssue, true);
  assert.deepEqual(groupCartByStore([]), { groups: [], total: 0, itemCount: 0, hasStockIssue: false });
});

test('planCheckout', () => {
  assert.deepEqual(planCheckout([], 0), { error: 'Keranjang kosong' });
  const rows = [
    { product_id: 1, name: 'Velg R17', price: 4000000, stock: 5, qty: 1, store_id: 9 },
    { product_id: 2, name: 'Oli 4L', price: 450000, stock: 10, qty: 2, store_id: 7 },
    { product_id: 3, name: 'Filter', price: 100000, stock: 3, qty: 3, store_id: 9 },
  ];
  const plan = planCheckout(rows, 3);
  assert.equal(plan.orders.length, 2);
  assert.equal(plan.orders.find((o) => o.storeId === 9).total, 4300000);
  assert.equal(plan.orders.find((o) => o.storeId === 7).items[0].name, 'Oli 4L');
  assert.deepEqual(planCheckout(rows, 4), { error: 'Ada produk yang tidak lagi tersedia. Periksa keranjang Anda.' });
  assert.deepEqual(planCheckout([{ ...rows[0], qty: 6 }], 1), { error: 'Stok Velg R17 tidak mencukupi (sisa 5)' });
});

test('groupCartByStore: item dari toko non-approved ditandai tidak tersedia dan memblokir checkout', () => {
  const r = groupCartByStore([
    { product_id: 1, qty: 2, price: 10000, stock: 5, store_id: 7, store_name: 'A', store_status: 'pending' },
    { product_id: 2, qty: 1, price: 5000, stock: 5, store_id: 9, store_name: 'B', store_status: 'approved' },
  ]);
  assert.equal(r.groups[0].items[0].unavailable, true);
  assert.equal(r.groups[1].items[0].unavailable, false);
  assert.equal(r.hasStockIssue, true);
  assert.equal(r.total, 5000);
  assert.equal(r.itemCount, 1);
});

test('addStockError: sisa dihitung dari stok dikurangi isi cart', () => {
  assert.equal(addStockError(5, 0, 5), null);
  assert.equal(addStockError(5, 4, 1), null);
  assert.equal(addStockError(5, 4, 2), 'Stok tidak mencukupi (sisa 1 lagi yang bisa ditambahkan)');
  assert.equal(addStockError(5, 5, 1), 'Stok tidak mencukupi (sudah ada 5 di keranjang)');
  assert.equal(addStockError(0, 0, 1), 'Stok tidak mencukupi (stok habis)');
});

test('parseProductIdBody', () => {
  assert.deepEqual(parseProductIdBody({ productId: 3 }), { productId: 3 });
  for (const bad of [null, {}, { productId: 'x' }, { productId: 0 }, { productId: 1.5 }, 'x'])
    assert.deepEqual(parseProductIdBody(bad), { error: 'Data tidak valid' });
});
