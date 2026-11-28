import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { youtubeId, youtubeThumbnail, videoJsonLd } from '../src/lib/video.ts';

test('reads the id from every plain YouTube URL form', () => {
  assert.equal(youtubeId('https://www.youtube.com/shorts/c4UijzLkxFM'), 'c4UijzLkxFM');
  assert.equal(youtubeId('https://www.youtube.com/watch?v=Tatb6yie2bk'), 'Tatb6yie2bk');
  assert.equal(youtubeId('https://youtu.be/K5_Zc7t8yxM'), 'K5_Zc7t8yxM');
  assert.equal(youtubeId('https://www.youtube.com/embed/040o-qNmDag'), '040o-qNmDag');
});

test('rejects anything that is not a video URL', () => {
  assert.equal(youtubeId('https://www.youtube.com/@FrugalAIEngineer'), null);
  assert.equal(youtubeId('https://example.com/shorts/c4UijzLkxFM'), null);
  assert.equal(youtubeId('https://www.youtube.com/shorts/short'), null);
  assert.equal(youtubeId('not a url'), null);
});

test('a VideoObject needs the upload date and a real video id', () => {
  const video = { url: 'https://www.youtube.com/shorts/c4UijzLkxFM', uploadedOn: new Date('2026-11-20') };
  const ld = videoJsonLd({ name: 'N', description: 'D', video });
  assert.equal(ld.uploadDate, '2026-11-20T00:00:00.000Z');
  assert.equal(ld.embedUrl, 'https://www.youtube.com/embed/c4UijzLkxFM');
  assert.deepEqual(ld.thumbnailUrl, [youtubeThumbnail('c4UijzLkxFM')]);
  assert.equal(videoJsonLd({ name: 'N', description: 'D', video: { url: video.url } }), null);
  assert.equal(videoJsonLd({ name: 'N', description: 'D', video: { url: 'https://example.com/x', uploadedOn: new Date() } }), null);
});

test('every video in the content is a plain, valid YouTube video URL', () => {
  for (const section of ['experiments', 'articles', 'architecture']) {
    const dir = path.join(process.cwd(), 'src/content', section);
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith('.md')) continue;
      const fm = fs.readFileSync(path.join(dir, name), 'utf8').split('\n---\n')[0];
      const m = fm.match(/^video:\s*\n\s+url:\s*"([^"]+)"/m);
      if (!m) continue;
      assert.ok(youtubeId(m[1]), `${section}/${name}: ${m[1]}`);
      assert.ok(!/[?&](si|feature|utm_[a-z]+)=/.test(m[1]), `${section}/${name} has a tracking parameter`);
    }
  }
});
