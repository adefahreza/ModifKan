import fs from 'node:fs';
import path from 'node:path';

const NAME_RE = /^[a-z0-9-]+(\/[a-z0-9-]+)*$/;
const cache = new Map();

export function loadSql(name) {
  if (typeof name !== 'string' || !NAME_RE.test(name)) {
    throw new Error(`Nama query tidak valid: ${name}`);
  }
  if (cache.has(name)) return cache.get(name);
  const file = path.join(process.cwd(), 'src', 'db', 'queries', `${name}.sql`);
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') throw new Error(`File query tidak ditemukan: ${name}`);
    throw err;
  }
  cache.set(name, text);
  return text;
}
