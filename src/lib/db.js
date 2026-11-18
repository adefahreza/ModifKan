import pg from 'pg';
import { loadSql } from './sql.js';

function getPool() {
  if (!globalThis.__modifkanPool) {
    globalThis.__modifkanPool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  }
  return globalThis.__modifkanPool;
}

export function query(name, params = []) {
  return getPool().query(loadSql(name), params);
}

export async function withTransaction(fn) {
  const client = await getPool().connect();
  const tx = { query: (name, params = []) => client.query(loadSql(name), params) };
  try {
    await tx.query('tx/begin');
    const result = await fn(tx);
    await tx.query('tx/commit');
    return result;
  } catch (err) {
    try {
      await tx.query('tx/rollback');
    } catch {
      // koneksi sudah rusak; error asli yang dilempar
    }
    throw err;
  } finally {
    client.release();
  }
}

export async function closePool() {
  const pool = globalThis.__modifkanPool;
  globalThis.__modifkanPool = undefined;
  if (pool) await pool.end();
}
