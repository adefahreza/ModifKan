import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { query, closePool } from '../src/lib/db.js';

test('ganti password: sesi lain milik user dihapus, sesi saat ini dan user lain tetap', { skip: !process.env.DATABASE_URL }, async () => {
  const uid = async (email) => (await query('auth/find-user-by-email', [email])).rows[0].id;
  const dewi = await uid('dewi@modifkan.test');
  const bagas = await uid('bagas@modifkan.test');
  const exp = new Date(Date.now() + 60_000);
  const tokens = ['test-dewi-current', 'test-dewi-other', 'test-bagas'];
  try {
    await query('auth/create-session', [tokens[0], dewi, exp]);
    await query('auth/create-session', [tokens[1], dewi, exp]);
    await query('auth/create-session', [tokens[2], bagas, exp]);

    await query('auth/delete-other-sessions', [dewi, 'test-dewi-current']);

    const dewiTokens = (await query('testing/list-session-tokens', [dewi])).rows.map((r) => r.token);
    assert.deepEqual(dewiTokens, ['test-dewi-current']);
    const bagasTokens = (await query('testing/list-session-tokens', [bagas])).rows.map((r) => r.token);
    assert.ok(bagasTokens.includes('test-bagas'));
  } finally {
    for (const t of tokens) await query('auth/delete-session', [t]);
  }
});
after(() => closePool?.());
