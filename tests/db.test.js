import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { query, withTransaction, closePool } from '../src/lib/db.js';

test('admin seed bisa dibaca', { skip: !process.env.DATABASE_URL }, async () => {
  const { rows } = await query('auth/find-user-by-email', ['admin@modifkan.test']);
  assert.equal(rows[0].role, 'admin');
});
test('withTransaction rollback', { skip: !process.env.DATABASE_URL }, async () => {
  await assert.rejects(withTransaction(async (tx) => {
    await tx.query('auth/find-user-by-email', ['admin@modifkan.test']);
    throw new Error('batal');
  }), /batal/);
});
after(() => closePool?.());
