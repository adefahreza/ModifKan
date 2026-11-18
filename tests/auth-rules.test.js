import test from 'node:test';
import assert from 'node:assert/strict';
import { homePathFor, safeNext } from '../src/lib/auth-rules.js';

test('homePathFor', () => {
  assert.equal(homePathFor(null), '/login');
  assert.equal(homePathFor({ role: 'admin' }), '/admin');
  assert.equal(homePathFor({ role: 'seller', storeStatus: 'approved' }), '/seller');
  assert.equal(homePathFor({ role: 'seller', storeStatus: 'pending' }), '/seller/pending');
  assert.equal(homePathFor({ role: 'seller', storeStatus: 'rejected' }), '/seller/pending');
  assert.equal(homePathFor({ role: 'buyer' }), '/');
});
test('safeNext', () => {
  assert.equal(safeNext('/cart'), '/cart');
  assert.equal(safeNext('/products/3?q=velg'), '/products/3?q=velg');
  for (const bad of ['//evil.com', 'https://evil.com', '/\\evil.com', 'cart', '', null, '/x?u=https://evil.com'])
    assert.equal(safeNext(bad), null);
});
