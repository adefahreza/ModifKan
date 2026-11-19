import test from 'node:test';
import assert from 'node:assert/strict';
import { ORDER_STATUSES, STATUS_LABELS, isOrderStatus } from '../src/lib/order-rules.js';

test('order-rules', () => {
  assert.deepEqual(ORDER_STATUSES, ['menunggu_pembayaran', 'diproses', 'dikirim', 'selesai', 'dibatalkan']);
  assert.equal(STATUS_LABELS.menunggu_pembayaran, 'Menunggu Pembayaran');
  assert.equal(STATUS_LABELS.dibatalkan, 'Dibatalkan');
  assert.equal(isOrderStatus('dikirim'), true);
  assert.equal(isOrderStatus('hapus'), false);
  assert.equal(isOrderStatus(undefined), false);
});
