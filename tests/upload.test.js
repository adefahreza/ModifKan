import test from 'node:test';
import assert from 'node:assert/strict';
import { isSafeImageName, extFromType, contentTypeFor } from '../src/lib/upload.js';

test('isSafeImageName', () => {
  assert.equal(isSafeImageName('a1b2c3.webp'), true);
  assert.equal(isSafeImageName('seed/1-1.webp'), true);
  assert.equal(isSafeImageName('seed/1-1.svg'), true);
  for (const bad of ['../.env.local', 'seed/../../db/schema.sql', 'x.svg', 'x.gif', 'A.PNG', '', null, 'seed/sub/x.webp'])
    assert.equal(isSafeImageName(bad), false);
});

test('extFromType & contentTypeFor', () => {
  assert.equal(extFromType('image/jpeg'), 'jpg');
  assert.equal(extFromType('image/png'), 'png');
  assert.equal(extFromType('image/webp'), 'webp');
  assert.equal(extFromType('image/gif'), null);
  assert.equal(contentTypeFor('seed/1-1.svg'), 'image/svg+xml');
  assert.equal(contentTypeFor('a.jpg'), 'image/jpeg');
});
