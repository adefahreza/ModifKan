import test from 'node:test';
import assert from 'node:assert/strict';
import { parseProductFilters, toQueryString } from '../src/lib/product-filters.js';

test('parseProductFilters', () => {
  assert.deepEqual(parseProductFilters({}), { q: null, categoryId: null, minPrice: null, maxPrice: null, minRating: null, sort: 'terbaru' });
  assert.deepEqual(parseProductFilters({ q: ' velg ', category: '3', min: '100000', max: '5000000', sort: 'harga_terendah' }),
    { q: 'velg', categoryId: 3, minPrice: 100000, maxPrice: 5000000, minRating: null, sort: 'harga_terendah' });
  assert.deepEqual(parseProductFilters({ min: 'abc', max: '-5', sort: 'xyz', category: '1;drop' }),
    { q: null, categoryId: null, minPrice: null, maxPrice: null, minRating: null, sort: 'terbaru' });
  const swapped = parseProductFilters({ min: '900', max: '100' });
  assert.equal(swapped.minPrice, 100); assert.equal(swapped.maxPrice, 900);
  assert.equal(parseProductFilters({ q: ['a', 'b'] }).q, 'a');
});

test('parseProductFilters: rating', () => {
  assert.equal(parseProductFilters({ rating: '4' }).minRating, 4);
  assert.equal(parseProductFilters({ rating: ['3', '5'] }).minRating, 3);
  for (const bad of ['0', '6', '-1', 'abc', '4;x', '', '4.5']) {
    assert.equal(parseProductFilters({ rating: bad }).minRating, null, `"${bad}" harus diabaikan`);
  }
});

test('toQueryString', () => {
  const f = { q: 'velg', categoryId: null, minPrice: null, maxPrice: null, minRating: null, sort: 'terbaru' };
  assert.equal(toQueryString(f, { categoryId: 2 }), '?q=velg&category=2');
  assert.equal(toQueryString(f, { q: null }), '');
  assert.equal(toQueryString(f, { minRating: 4 }), '?q=velg&rating=4');
});
