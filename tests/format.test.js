import test from 'node:test';
import assert from 'node:assert/strict';
import { formatRupiah, formatOrderNumber, formatDate, imageUrl } from '../src/lib/format.js';

test('format', () => {
  assert.equal(formatRupiah(4250000), 'Rp4.250.000');
  assert.equal(formatRupiah(0), 'Rp0');
  assert.equal(formatOrderNumber(1), '#ORD-0001');
  assert.equal(formatOrderNumber(12345), '#ORD-12345');
  assert.equal(formatDate(new Date('2026-11-17T20:00:00Z')), '18 Nov 2026');
});

test('imageUrl', () => {
  assert.equal(imageUrl('abc.webp'), '/api/images/abc.webp');
  assert.equal(imageUrl('seed/1-1.webp'), '/api/images/seed/1-1.webp');
  assert.equal(imageUrl(null), null);
  assert.equal(imageUrl(''), null);
});
