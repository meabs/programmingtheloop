import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readingMinutes } from '../src/lib/reading-time.mjs';

const words = (n) => Array.from({ length: n }, (_, i) => `word${i}`).join(' ');

test('rounds to whole minutes at 200 words a minute, minimum one', () => {
  assert.equal(readingMinutes(words(2000)), 10);
  assert.equal(readingMinutes(words(2149)), 11);
  assert.equal(readingMinutes(words(30)), 1);
  assert.equal(readingMinutes(''), 1);
});

test('ignores HTML tags, code fences and link targets', () => {
  const md = `${words(200)}\n<figure><img src="/a.png" alt="x" /></figure>\n\`\`\`\n${words(1000)}\n\`\`\`\n[a link](https://example.com/very/long/path)`;
  assert.equal(readingMinutes(md), 1);
});
