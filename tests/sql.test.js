import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSql } from '../src/lib/sql.js';

test('loadSql membaca file', () => assert.match(loadSql('tx/begin'), /BEGIN/i));
test('loadSql menolak path traversal', () => assert.throws(() => loadSql('../schema'), /Nama query tidak valid/));
test('loadSql file hilang', () => assert.throws(() => loadSql('tidak/ada'), /File query tidak ditemukan/));
