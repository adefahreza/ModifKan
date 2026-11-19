import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ORDER_STATUSES, STATUS_LABELS, isOrderStatus,
  availableActions, resolveTransition, timelineIndex,
} from '../src/lib/order-rules.js';

test('order-rules', () => {
  assert.deepEqual(ORDER_STATUSES, ['menunggu_pembayaran', 'diproses', 'dikirim', 'selesai', 'dibatalkan']);
  assert.equal(STATUS_LABELS.menunggu_pembayaran, 'Menunggu Pembayaran');
  assert.equal(STATUS_LABELS.dibatalkan, 'Dibatalkan');
  assert.equal(isOrderStatus('dikirim'), true);
  assert.equal(isOrderStatus('hapus'), false);
  assert.equal(isOrderStatus(undefined), false);
});

test('aksi yang tersedia', () => {
  assert.deepEqual(availableActions('menunggu_pembayaran', 'seller'), ['konfirmasi', 'batalkan']);
  assert.deepEqual(availableActions('menunggu_pembayaran', 'buyer'), ['batalkan']);
  assert.deepEqual(availableActions('diproses', 'seller'), ['kirim']);
  assert.deepEqual(availableActions('diproses', 'buyer'), []);
  assert.deepEqual(availableActions('dikirim', 'buyer'), ['terima']);
  assert.deepEqual(availableActions('dikirim', 'seller'), []);
  assert.deepEqual(availableActions('selesai', 'seller'), []);
  assert.deepEqual(availableActions('dibatalkan', 'buyer'), []);
  assert.deepEqual(availableActions('menunggu_pembayaran', 'admin'), []);
});

test('resolveTransition', () => {
  assert.deepEqual(resolveTransition('kirim', 'seller'), { from: 'diproses', to: 'dikirim' });
  assert.equal(resolveTransition('terima', 'seller'), null);
  assert.equal(resolveTransition('hapus', 'seller'), null);
});

test('timelineIndex', () => {
  assert.equal(timelineIndex('menunggu_pembayaran'), 0);
  assert.equal(timelineIndex('selesai'), 3);
  assert.equal(timelineIndex('dibatalkan'), -1);
});
