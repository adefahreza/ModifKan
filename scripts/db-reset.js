import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();
  for (const file of ['schema.sql', 'seed.sql']) {
    const sql = fs.readFileSync(path.join(process.cwd(), 'src', 'db', file), 'utf8');
    await client.query(sql);
    console.log(`OK: ${file}`);
  }
} catch (err) {
  console.error('Gagal:', err.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
